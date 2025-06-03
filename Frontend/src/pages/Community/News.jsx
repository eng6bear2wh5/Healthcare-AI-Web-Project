import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

export default function NewsPage() {
  useEffect(() => {
    document.title = "Tin tức | HealthTrust";
  }, []);
  const [groups, setGroups] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [articles, setArticles] = useState([]);
  const [filterGroupId, setFilterGroupId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Lấy data từ backend
  useEffect(() => {
    fetch("/api/news/news-data")
      .then(r => r.json())
      .then(({ groups, diseases, articles }) => {
        setGroups(groups);
        setDiseases(diseases);
        setArticles(articles);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải dữ liệu tin tức:", err);
        setLoading(false);
      });
  }, []);

  // 2. Build map để tra cứu nhanh
  const diseaseMap = React.useMemo(() => Object.fromEntries(
    diseases.map(d => [d._id, d])
  ), [diseases]);
  const groupMap = React.useMemo(() => Object.fromEntries(
    groups.map(g => [g._id, g])
  ), [groups]);

  // 3. Enrich articles với thông tin disease + group
  const enriched = React.useMemo(() => articles.map(a => {
    const dis = diseaseMap[a.disease_id] || {};
    return {
      ...a,
      disease: dis,
      group: groupMap[dis.group_diseases] || {}
    };
  }), [articles, diseaseMap, groupMap]);

  // 4. Danh sách nhóm hiển thị (all hoặc riêng nhóm lọc)
  const groupsToDisplay = filterGroupId
    ? [groupMap[filterGroupId]].filter(Boolean)
    : groups;

  // 5. Xác định ảnh LCP (ảnh bài báo đầu tiên sau khi enrich)
  const lcpImage = !loading && enriched[0]?.disease?.image_url;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Helmet>
        {lcpImage && (
          <link rel="preload" as="image" href={lcpImage} />
        )}
      </Helmet>
      <h2 className="text-3xl text-center font-bold text-blue-600 mb-6">Tin tức về bệnh</h2>
      
      {/* Dropdown chọn nhóm + nút xóa filter */}
      <div className="mb-6 flex justify-center items-center gap-4">
        <label htmlFor="group-select" className="sr-only">
          Chọn nhóm bệnh
        </label>
        <select
          id="group-select"
          value={filterGroupId || ""}
          onChange={e => setFilterGroupId(e.target.value || null)}
          className="p-2 border border-black-300 rounded w-64"
        >
          <option value="">-- Chọn nhóm bệnh --</option>
          {groups.map(g => (
            <option key={g._id} value={g._id}>{g.name_group}</option>
          ))}
        </select>
        {filterGroupId && (
          <button
            onClick={() => setFilterGroupId(null)}
            className="text-red-500 font-bold text-xl"
            title="Xóa bộ lọc"
          >
            ×
          </button>
        )}
      </div>

      {/* Skeleton khi loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="border rounded shadow p-4 animate-pulse h-60">
              <div className="w-full h-40 bg-black-200 rounded mb-4"></div>
              <div className="h-6 bg-black-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-black-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        groupsToDisplay.map(g => {
          // Lọc bài báo của nhóm này
          const list = enriched.filter(a => a.group._id === g._id);

          return (
            <div key={g._id} className="mb-10">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <img
                  src={g.image_url}
                  alt={g.name_group}
                  className="w-10 h-10 object-cover rounded"
                  width={40}
                  height={40}
                />
                {g.name_group}
              </h3>

              {list.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((a, idx) => (
                    <a
                      key={idx}
                      href={a.article_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border rounded overflow-hidden shadow hover:shadow-lg hover:bg-blue-50 transition block"
                    >
                      <img
                        src={a.disease.image_url}
                        alt={a.disease.name_diseases}
                        className="w-full h-40 object-cover"
                        width={400}
                        height={160}
                      />
                      <div className="p-4">
                        <h4 className="font-bold text-blue-700 text-lg mb-2">
                          {a.article_name}
                        </h4>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-black-500 italic">Không có tin tức về nhóm bệnh này.</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
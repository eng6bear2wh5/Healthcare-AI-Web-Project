// // import React, { useState } from "react";
// // import { useParams } from "react-router-dom";

// // const fakeDiseaseDetails = {
// //     hd1: {
// //         name: "Bệnh mạch vành",
// //         image: "https://images2.thanhnien.vn/528068263637045248/2024/1/25/c3c8177f2e6142e8c4885dbff89eb92a-65a11aeea03da880-1706156293184503262817.jpg",
// //         description: "Bệnh mạch vành xảy ra khi các mạch máu cung cấp máu cho tim bị thu hẹp hoặc tắc nghẽn.",
// //         info: "Nguyên nhân chính là xơ vữa động mạch. Triệu chứng bao gồm đau ngực, khó thở, mệt mỏi.",
// //         articles: [
// //             {
// //                 title: "Tìm hiểu bệnh mạch vành",
// //                 url: "https://vnexpress.net/benh-mach-vanh-la-gi-1234567.html",
// //                 image: "https://images2.thanhnien.vn/528068263637045248/2024/1/25/c3c8177f2e6142e8c4885dbff89eb92a-65a11aeea03da880-1706156293184503262817.jpg",
// //                 source: "VnExpress"
// //             },
// //             {
// //                 title: "Điều trị bệnh mạch vành như thế nào?",
// //                 url: "https://suckhoedoisong.vn/dieu-tri-benh-mach-vanh-654321.html",
// //                 source: "Sức khỏe & Đời sống"
// //             }
// //         ]
// //     },
// //     hd2: {
// //         name: "Suy tim",
// //         image: "https://via.placeholder.com/600x300?text=Suy+tim",
// //         description: "Suy tim là tình trạng tim không bơm đủ máu để đáp ứng nhu cầu của cơ thể.",
// //         info: "Gồm các triệu chứng: phù chân, mệt mỏi, ho kéo dài. Điều trị bằng thuốc và thay đổi lối sống.",
// //         article: "https://suckhoedoisong.vn/suy-tim-la-gi-98765.html"
// //     },
// //     ld1: {
// //         name: "Hen suyễn",
// //         image: "https://via.placeholder.com/600x300?text=Hen+suyễn",
// //         description: "Hen suyễn là bệnh mãn tính về đường hô hấp, khiến đường thở bị viêm và hẹp.",
// //         info: "Triệu chứng gồm khó thở, ho về đêm, khò khè. Cần tránh dị nguyên và dùng thuốc kiểm soát.",
// //         article: "https://hellobacsi.com/benh-hen-suyen/"
// //     },
// // };

// // export default function DiseaseDetail() {
// //     const { diseaseId } = useParams();
// //     const [searchTerm, setSearchTerm] = useState("");

// //     const filteredDiseases = Object.entries(fakeDiseaseDetails).filter(([id, disease]) =>
// //         disease.name.toLowerCase().includes(searchTerm.toLowerCase())
// //     );

// //     const displayDiseases = diseaseId
// //         ? [[diseaseId, fakeDiseaseDetails[diseaseId]]]
// //         : filteredDiseases;

// //     if (!displayDiseases || displayDiseases.length === 0) {
// //         return (
// //             <div className="max-w-4xl mx-auto p-6">
// //                 <div className="mb-6 flex justify-center">
// //                     <input
// //                         type="text"
// //                         placeholder="Tìm bệnh theo tên..."
// //                         value={searchTerm}
// //                         onChange={(e) => setSearchTerm(e.target.value)}
// //                         className="w-[400px] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
// //                     />
// //                 </div>
// //                 <p className="text-center text-gray-500">Không tìm thấy thông tin bệnh phù hợp.</p>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="max-w-4xl mx-auto p-6">
// //             {/* Thanh tìm kiếm (chỉ hiển thị khi không có diseaseId) */}
// //             {!diseaseId && (
// //                 <div className="mb-8 flex justify-center">
// //                     <input
// //                         type="text"
// //                         placeholder="Tìm bệnh theo tên..."
// //                         value={searchTerm}
// //                         onChange={(e) => setSearchTerm(e.target.value)}
// //                         className="w-[400px] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
// //                     />
// //                 </div>
// //             )}

// //             {displayDiseases.map(([id, disease]) => (
// //                 <div key={id} className="mb-10 border-b pb-10">
// //                     <h1 className="text-3xl font-bold mb-4 text-blue-700">{disease.name}</h1>
// //                     <img
// //                         src={disease.image}
// //                         alt={disease.name}
// //                         className="w-full h-64 object-cover rounded mb-6"
// //                     />

// //                     <div className="mb-6">
// //                         <h2 className="text-xl font-semibold mb-2 text-gray-800">Thông tin chung</h2>
// //                         <p>{disease.info}</p>
// //                     </div>

// //                     <div className="mb-6">
// //                         <h2 className="text-xl font-semibold mb-2 text-gray-800">Mô tả chi tiết</h2>
// //                         <p>{disease.description}</p>
// //                     </div>

// //                     <div>
// //                         <h2 className="text-xl font-semibold mb-4 text-gray-800">Bài báo liên quan</h2>
// //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                             {(disease.articles || [disease.article]).map((article, index) => {
// //                                 if (!article) return null;

// //                                 const isObject = typeof article === "object";

// //                                 return (
// //                                     <a
// //                                         key={index}
// //                                         href={isObject ? article.url : article}
// //                                         target="_blank"
// //                                         rel="noopener noreferrer"
// //                                         className="border p-4 rounded shadow hover:shadow-lg hover:bg-blue-50 transition block"
// //                                     >
// //                                         {isObject && article.image && (
// //                                             <img
// //                                                 src={article.image}
// //                                                 alt={article.title}
// //                                                 className="w-full h-40 object-cover rounded mb-2"
// //                                             />
// //                                         )}
// //                                         <h3 className="font-bold text-blue-600 text-lg">
// //                                             {isObject ? article.title : "Xem bài viết"}
// //                                         </h3>
// //                                         {isObject && (
// //                                             <p className="text-sm text-gray-500 mt-1">{article.source}</p>
// //                                         )}
// //                                     </a>
// //                                 );
// //                             })}
// //                         </div>
// //                     </div>
// //                 </div>
// //             ))}
// //         </div>
// //     );
// // }
// // src/pages/Category/DiseaseDetail.jsx
// // import React, { useState, useEffect } from "react";
// // import { useParams } from "react-router-dom";

// // export default function DiseaseDetail() {
// //   const { diseaseId } = useParams();
// //   const [disease, setDisease] = useState(null);
// //   const [articles, setArticles] = useState([]);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     // 1. Lấy thông tin bệnh theo ID
// //     fetch(`/api/diseases/id/${diseaseId}`)
// //       .then(res => {
// //         if (!res.ok) throw new Error("Không tìm thấy bệnh");
// //         return res.json();
// //       })
// //       .then(data => {
// //         setDisease(data);
// //         // 2. Sau khi có data.DISEASE_ID (ở MongoDB là _id), gọi API lấy bài báo
// //         return fetch(`/api/articles/by-disease/${diseaseId}`);
// //       })
// //       .then(res => {
// //         if (!res.ok) throw new Error("Không lấy được bài báo");
// //         return res.json();
// //       })
// //       .then(arts => setArticles(arts))
// //       .catch(err => setError(err.message));
// //   }, [diseaseId]);

// //   if (error) {
// //     return (
// //       <div className="max-w-4xl mx-auto p-6">
// //         <h2 className="text-red-600 text-center">Lỗi: {error}</h2>
// //       </div>
// //     );
// //   }

// //   if (!disease) {
// //     return (
// //       <div className="max-w-4xl mx-auto p-6">
// //         <p className="text-center text-gray-500">Đang tải thông tin...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="max-w-4xl mx-auto p-6">
// //       {/* Tên bệnh */}
// //       <h1 className="text-3xl font-bold mb-4 text-blue-700">
// //         {disease.NAME_DISEASES}
// //       </h1>

// //       {/* Ảnh bệnh */}
// //       {disease.IMAGE_URL && (
// //         <img
// //           src={disease.IMAGE_URL}
// //           alt={disease.NAME_DISEASES}
// //           className="w-full h-64 object-cover rounded mb-6"
// //         />
// //       )}

// //       {/* Mô tả */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold mb-2 text-gray-800">Mô tả bệnh</h2>
// //         <p>{disease.DESCRIPTION_DISEASE}</p>
// //       </div>

// //       {/* Thông tin chung */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold mb-2 text-gray-800">Thông tin chung</h2>
// //         {/* nếu bạn lưu html trong `details`, dùng dangerouslySetInnerHTML */}
// //         <p dangerouslySetInnerHTML={{ __html: disease.DETAILS }} />
// //       </div>

// //       {/* Bài báo liên quan */}
// //       <div>
// //         <h2 className="text-xl font-semibold mb-4 text-gray-800">Bài báo liên quan</h2>
// //         {articles.length > 0 ? (
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 articles-container">
// //             {articles.map((art, idx) => (
// //               <a
// //                 key={idx}
// //                 href={art.ARTICLE_LINK}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="article-box block border p-4 rounded shadow hover:shadow-lg hover:bg-blue-50 transition"
// //               >
// //                 <h3 className="article-title font-bold text-blue-600">{art.ARTICLE_NAME}</h3>
// //               </a>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-gray-500 italic">Không có bài báo liên quan.</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// // // src/pages/Category/DiseaseDetail.jsx
// // import React, { useState, useEffect } from "react";
// // import { useParams } from "react-router-dom";

// // export default function DiseaseDetail() {
// //   const { diseaseId } = useParams();

// //   const [disease, setDisease] = useState(null);
// //   const [articles, setArticles] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     // Hàm async để fetch song song data bệnh và bài báo
// //     async function fetchData() {
// //       setLoading(true);
// //       setError(null);
// //       try {
// //         // 1. Lấy thông tin bệnh
// //         const resDisease = await fetch(`/api/diseases/id/${diseaseId}`);
// //         if (!resDisease.ok) {
// //           throw new Error(`Không tìm thấy bệnh với ID ${diseaseId}`);
// //         }
// //         const diseaseData = await resDisease.json();
// //         setDisease(diseaseData);

// //         // 2. Lấy bài báo liên quan
// //         const resArticles = await fetch(`/api/articles/by-disease/${diseaseId}`);
// //         if (!resArticles.ok) {
// //           throw new Error("Không lấy được bài báo liên quan");
// //         }
// //         const articlesData = await resArticles.json();
// //         setArticles(articlesData);
// //       } catch (e) {
// //         console.error(e);
// //         setError(e.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     fetchData();
// //   }, [diseaseId]);

// //   if (loading) {
// //     return (
// //       <section className="max-w-4xl mx-auto p-6">
// //         <p className="text-center text-gray-500">Đang tải thông tin bệnh...</p>
// //       </section>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <section className="max-w-4xl mx-auto p-6">
// //         <h2 className="text-2xl text-center text-red-600">Lỗi: {error}</h2>
// //       </section>
// //     );
// //   }

// //   if (!disease) {
// //     return (
// //       <section className="max-w-4xl mx-auto p-6">
// //         <p className="text-center text-gray-500">Không tìm thấy thông tin bệnh.</p>
// //       </section>
// //     );
// //   }

// //   return (
// //     <div className="max-w-4xl mx-auto p-6">
// //       <h1 className="text-3xl font-bold mb-4 text-blue-700">{disease.name_diseases}</h1>
// //       <img
// //         src={disease.image_url || "https://via.placeholder.com/600x300"}
// //         alt={disease.name_diseases}
// //         className="w-full h-64 object-cover rounded mb-6"
// //       />

// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold mb-2 text-gray-800">Thông tin chung</h2>
// //         <p>{disease.details}</p>
// //       </div>

// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold mb-2 text-gray-800">Mô tả bệnh</h2>
// //         <p>{disease.description_disease}</p>
// //       </div>

// //       <div>
// //         <h2 className="text-xl font-semibold mb-4 text-gray-800">Bài báo liên quan</h2>
// //         {articles.length > 0 ? (
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             {articles.map((article, idx) => (
// //               <a
// //                 key={article._id || idx}
// //                 href={article.article_link}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="border p-4 rounded shadow hover:shadow-lg hover:bg-blue-50 transition block"
// //               >
// //                 {article.article_image_url && (
// //                   <img
// //                     src={article.article_image_url}
// //                     alt={article.article_name}
// //                     className="w-full h-40 object-cover rounded mb-2"
// //                   />
// //                 )}
// //                 <h3 className="font-bold text-blue-600 text-lg">
// //                   {article.article_name}
// //                 </h3>
// //               </a>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-center text-gray-500 italic">Không có bài báo liên quan.</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // src/pages/Category/DiseaseDetail.jsx
// // import React, { useState, useEffect } from "react";
// // import { useParams } from "react-router-dom";
// // import DOMPurify from "dompurify";

// // export default function DiseaseDetail() {
// //   const { diseaseId } = useParams();

// //   const [disease, setDisease] = useState(null);
// //   const [articles, setArticles] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     async function fetchData() {
// //       setLoading(true);
// //       setError(null);
// //       try {
// //         // 1. Lấy thông tin bệnh (kèm trường details là chuỗi HTML từ DB)
// //         const resDisease = await fetch(`/api/diseases/id/${diseaseId}`);
// //         if (!resDisease.ok) {
// //           throw new Error(`Không tìm thấy bệnh với ID ${diseaseId}`);
// //         }
// //         const diseaseData = await resDisease.json();
// //         setDisease(diseaseData);

// //         // 2. Lấy bài báo liên quan
// //         const resArticles = await fetch(`/api/articles/by-disease/${diseaseId}`);
// //         if (!resArticles.ok) {
// //           throw new Error("Không lấy được bài báo liên quan");
// //         }
// //         const articlesData = await resArticles.json();
// //         setArticles(articlesData);
// //       } catch (e) {
// //         console.error(e);
// //         setError(e.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //     fetchData();
// //   }, [diseaseId]);

// //   if (loading) {
// //     return (
// //       <section className="max-w-4xl mx-auto p-6">
// //         <p className="text-center text-gray-500">Đang tải thông tin bệnh...</p>
// //       </section>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <section className="max-w-4xl mx-auto p-6">
// //         <h2 className="text-2xl text-center text-red-600">Lỗi: {error}</h2>
// //       </section>
// //     );
// //   }

// //   if (!disease) {
// //     return (
// //       <section className="max-w-4xl mx-auto p-6">
// //         <p className="text-center text-gray-500">Không tìm thấy thông tin bệnh.</p>
// //       </section>
// //     );
// //   }

// //   return (
// //     <div className="max-w-4xl mx-auto p-6">
// //       {/* Tiêu đề và ảnh */}
// //       <h1 className="text-3xl font-bold mb-4 text-blue-700">
// //         {disease.name_diseases}
// //       </h1>
// //       <img
// //         src={disease.image_url || "https://via.placeholder.com/600x300"}
// //         alt={disease.name_diseases}
// //         className="w-full h-64 object-cover rounded mb-6"
// //       />

// //       {/* Mô tả bệnh */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold mb-2 text-gray-800">Mô tả bệnh</h2>
// //         <p>{disease.description_disease}</p>
// //       </div>

// //       {/* Thông tin chung (HTML từ Quill, đã sanitized) */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold mb-2 text-gray-800">Thông tin chung</h2>
// //         <div
// //           className="prose max-w-none"
// //           dangerouslySetInnerHTML={{
// //             __html: DOMPurify.sanitize(disease.details || ""),
// //           }}
// //         />
// //       </div>

// //       {/* Bài báo liên quan */}
// //       <div>
// //         <h2 className="text-xl font-semibold mb-4 text-gray-800">
// //           Bài báo liên quan
// //         </h2>
// //         {articles.length > 0 ? (
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             {articles.map((article, idx) => (
// //               <a
// //                 key={article._id || idx}
// //                 href={article.article_link}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="border p-4 rounded shadow hover:shadow-lg hover:bg-blue-50 transition block"
// //               >
// //                 <h3 className="font-bold text-blue-600 text-lg">
// //                   {article.article_name}
// //                 </h3>
// //               </a>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-center text-gray-500 italic">
// //             Không có bài báo liên quan.
// //           </p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // // src/pages/Category/DiseaseDetail.jsx
// // import React, { useState, useEffect } from "react";
// // import { useParams } from "react-router-dom";
// // import DOMPurify from "dompurify"; // npm install dompurify

// // export default function DiseaseDetail() {
// //   const { diseaseId } = useParams();

// //   const [disease, setDisease] = useState(null);
// //   const [articles, setArticles] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     async function fetchData() {
// //       setLoading(true);
// //       try {
// //         // 1. Lấy thông tin bệnh
// //         const resDisease = await fetch(`/api/diseases/id/${diseaseId}`);
// //         if (!resDisease.ok) throw new Error(`Không tìm thấy bệnh với ID ${diseaseId}`);
// //         const diseaseData = await resDisease.json();
// //         setDisease(diseaseData);

// //         // 2. Lấy bài báo liên quan
// //         const resArticles = await fetch(`/api/articles/by-disease/${diseaseId}`);
// //         if (!resArticles.ok) throw new Error("Không lấy được bài báo liên quan");
// //         setArticles(await resArticles.json());
// //       } catch (e) {
// //         console.error(e);
// //         setError(e.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //     fetchData();
// //   }, [diseaseId]);

// //   if (loading) {
// //     return (
// //       <section className="max-w-4xl mx-auto p-6">
// //         <p className="text-center text-gray-500">Đang tải thông tin bệnh...</p>
// //       </section>
// //     );
// //   }
// //   if (error) {
// //     return (
// //       <section className="max-w-4xl mx-auto p-6">
// //         <h2 className="text-2xl text-center text-red-600">Lỗi: {error}</h2>
// //       </section>
// //     );
// //   }
// //   if (!disease) {
// //     return (
// //       <section className="max-w-4xl mx-auto p-6">
// //         <p className="text-center text-gray-500">Không tìm thấy thông tin bệnh.</p>
// //       </section>
// //     );
// //   }

// //   return (
// //     <div className="max-w-4xl mx-auto p-6 space-y-8">
// //       {/* Tiêu đề */}
// //       <h1 className="text-3xl font-bold text-blue-700">{disease.name_diseases}</h1>

// //       {/* Ảnh */}
// //       <img
// //         src={disease.image_url || "https://via.placeholder.com/600x300"}
// //         alt={disease.name_diseases}
// //         className="w-full h-64 object-cover rounded"
// //       />

// //       {/* Mô tả bệnh */}
// //       <section>
// //         <h2 className="text-2xl font-semibold mb-2">Mô tả bệnh</h2>
// //         <div
// //           className="prose prose-sm max-w-none"
// //           // Xử lý văn bản thuần
// //           dangerouslySetInnerHTML={{
// //             __html: DOMPurify.sanitize(
// //               disease.description_disease || "<p>Chưa có mô tả</p>"
// //             ),
// //           }}
// //         />
// //       </section>

// //       {/* Thông tin chung (chuỗi HTML đã lưu) */}
// //       <section>
// //         <h2 className="text-2xl font-semibold mb-2">Thông tin chung</h2>
// //         <div
// //           className="prose max-w-none"
// //           dangerouslySetInnerHTML={{
// //             __html: DOMPurify.sanitize(
// //               disease.details || "<p>Chưa có thông tin chung</p>"
// //             ),
// //           }}
// //         />
// //       </section>

// //       {/* Bài báo liên quan */}
// //       <section>
// //         <h2 className="text-2xl font-semibold mb-4">Bài báo liên quan</h2>
// //         {articles.length > 0 ? (
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             {articles.map((a) => (
// //               <a
// //                 key={a._id}
// //                 href={a.article_link}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="border rounded p-4 shadow hover:shadow-lg transition flex flex-col"
// //               >
// //                 {a.article_image_url && (
// //                   <img
// //                     src={a.article_image_url}
// //                     alt={a.article_name}
// //                     className="w-full h-40 object-cover rounded mb-4"
// //                   />
// //                 )}
// //                 <h3 className="font-bold text-blue-600 mb-2">{a.article_name}</h3>
// //               </a>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-center text-gray-500 italic">
// //             Không có bài báo liên quan.
// //           </p>
// //         )}
// //       </section>
// //     </div>
// //   );
// // }

// src/pages/Category/DiseaseDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

export default function DiseaseDetail() {
  const { diseaseId } = useParams();

  const [disease, setDisease] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Lấy info bệnh
        const resD = await fetch(`/api/diseases/id/${diseaseId}`);
        if (!resD.ok) throw new Error("Không tìm thấy bệnh");
        const diseaseData = await resD.json();
        setDisease(diseaseData);

        // 2. Lấy bài báo
        const resA = await fetch(`/api/articles/by-disease/${diseaseId}`);
        if (!resA.ok) throw new Error("Không lấy được bài báo");
        setArticles(await resA.json());
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [diseaseId]);

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-500">Đang tải...</p>
      </section>
    );
  }
  if (error) {
    return (
      <section className="max-w-4xl mx-auto p-6">
        <h2 className="text-center text-red-600">Lỗi: {error}</h2>
      </section>
    );
  }
  if (!disease) {
    return (
      <section className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-500">Không tìm thấy thông tin.</p>
      </section>
    );
  }

  return (
    <article className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold text-blue-700">{disease.name_diseases}</h1>

      {/* Ảnh */}
      <img
        src={disease.image_url || "https://via.placeholder.com/600x300"}
        alt={disease.name_diseases}
        className="w-full h-64 object-cover rounded"
      />

      {/* Mô tả bệnh */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Mô tả bệnh</h2>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(disease.description_disease || ""),
          }}
        />
      </section>

      {/* Thông tin chung (chuỗi HTML đã lưu) */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Thông tin chung</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(disease.details || ""),
          }}
        />
      </section>

      {/* Bài báo liên quan */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Bài báo liên quan</h2>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((a) => (
              <a
                key={a._id}
                href={a.article_link}
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded p-4 shadow hover:shadow-lg transition flex flex-col"
              >
                {a.article_image_url && (
                  <img
                    src={a.article_image_url}
                    alt={a.article_name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                )}
                <h3 className="font-bold text-blue-600">{a.article_name}</h3>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">Không có bài báo liên quan.</p>
        )}
      </section>
    </article>
  );
}

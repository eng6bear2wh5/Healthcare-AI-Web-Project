import { useEffect } from "react";
import React, { Suspense } from "react";
const DiseaseDetectButton = React.lazy(() =>
  import("../../components/DiseaseDetectButton")
);

const partners = [
  {
    name: "Bệnh viện Đa khoa Quốc tế Vinmec",
    description:
      "Hợp tác trong việc nghiên cứu và phát triển công nghệ y tế tiên tiến.",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbMOTKCX23wAP098EuU8pmY33o3QY-xTen6A&s",
  },
  {
    name: "Hello Bác sĩ",
    description:
      "Cung cấp nền tảng tư vấn sức khỏe trực tuyến và thông tin y tế.",
    logo: "data:image/png;base64,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",
  },
  {
    name: "Bệnh viện Chợ Rẫy",
    description:
      "Hợp tác trong việc nâng cao chất lượng dịch vụ y tế và đào tạo nhân lực.",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdB2uJqxCPADxfjpcFOYgam-WqvObz_czPuw&s",
  },
  {
    name: "Đại học Y Dược TP.HCM",
    description: "Đào tạo và nghiên cứu chuyên sâu về lĩnh vực y tế cộng đồng.",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuRdp-5TDYIBcQDhoqw8AcaYap1oTxuvGd5A&s",
  },
  {
    name: "Giọt máu vàng",
    description:
      "Hợp tác trong việc nâng cao nhận thức về hiến máu và hỗ trợ bệnh nhân.",
    logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAACjCAMAAAA3vsLfAAAAllBMVEX4+Pj////3xBz8/Pz39/f3wQD3wgD8///3wxL7/f/3wwz3xin6/P/4+//1xzj++/P1yEH402n42IL0zFjz1IH23Jj9+e368dr53pb88dX+/vv036r87sv4zlP76r/z58rz7d353I3zz2v646T21Hj35bfy6dDy4rv2xi/34q708OX99uPy4LH3zEr0zVz0y1Py26Dw48D0QVdoAAAIOUlEQVR4nO2ca3eqOhCGEUgCUaTaWu3dW1t7s/b//7kDZBICAorby1nJvOt8UI92N896JzOZjHUcFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQhslL1PknpT/h0qs4q/6RV4nepVdzHh2VmS3kTgDNAnAnomY4t1NBS3XptZ1MJ7OakKGGOzE1Q7mdnJqZ3E5PzcT97RzUzON2hhBNZVqYticwPIj0pdd5XLVHsCC/7ABsZtmt9fLviEuWh3C79EqPqdZmiwPXdcnoAGwm2a314n+4m3J7PYDbpdd6RLVd+pC4mciLzdhax+gqAGxv7bGZE6Wtsd2Sg6kZhK392p9TbuTd7hLkgMUvqUs2h1AzaHM7YO3hisxD8fAWse2vcTeCB6Qlt0uv9mhqs+iFjEz4VBzwVYjYduiVbIovPHGXzlttcpde7bHUov6Ik6PoWH9hkqXUjzbYTEmlLbBdczfoajF5BwXcuP4jiK3zkVKiS/X83hXHBfKA2OoVUwHpXb4wFy/w6x5iq9eAC0prSAHP8kT/2YKaddgeS5TuOTxvd1ywDZtbogTmC/pRG2q2YZsIswVXQEmZb9qKmmXYbsuUwHz0RoboPWLbFoSkojQTWdTlPrxhsaz9rL3YoLB1XaD0Jc33DW+IyZ5Fr1XYfoIipSfxPPiR+WDAg6u9MqpN2J5L+UCVbLIvniYIxRSxgeDSRV1VdWFjU1fM2RuCfZopFmF7BbOt4RgPxYjL5flgkb1AZ4hNVzcoFB8xUAtkp+1exuwenV57sIHZuKS0pPLEIIP2Bg71exQh9mDrF80miw83b77dywvn3ad6a7A9lswGlW+2m8nxmU3pPYhN1mjSbGNlNs1eTG5/O+1mCzaIyUDOAa65hk013+T+t3N3swXbUGAifwWKym6QFZgs7eIdP+7Syz2WdmCD4iJYwQFhwAvYglXRbrRhWNCzCNsH4HioNFs+HCh3N950seB5tmCDhECh9THkJWyqCAG+9TOWCTNrsN3KrV7EYlw2m3a7zIupo8RMUDPni+DN2Ba0sPOP6BY2ZTfoXFbWIMDMGmzQaJMDRrCBVe5usO3RRYXRsj9ZYA82iFE6E5H3uB2jaRcOwlJsg1vtSk83mx3Y5D4P7chBOSEU/q98cyFKPQ2ZNdiAE8To/fbOlkqeRCFfUH2Yq8jMFmxQi0Eefa6KUTc/GqxFlF5rUVo2mxXY4Ngup2XmlTGa1yAQpVw2x71O2Wt2YJO7Vax7ryIpPAl/yS8svAifbTOzBNsys1dwJQ5MdzUxmmcBcZ6n2ZhIFTNLsIm+Lh8KM1XUuhLbt46ZD8I6aFZgg8wpj/HruiBVuRSCetWzGttXsWrTqZFE+nNxwIIUQmOrsT0WMsKttrWtpuPx9CfnBpvbvZqBthkbxJwril0tIwT9NCh/NWziqM/EdT35C23GJnJAcCUi8LUBG2x/TBiQPliNTbSCZNW/oA3YJiyrbgcC28hqbKKVK9PkRGALEvHsBuGJpo9FKh2GaXXLRAVCZ4hNnUjBe0/XiTKSy9/kkbAcX2agGHzihiE26TaBjUxZomy3Sx8wkV9TtBq2odVuE6D4QD8klL8hL2o7fiPcBseEG6uxTQopQZQj1dggCTDRn6MTq7EtoADRO+L6ZHMepPQ9281kAbKxGhu0JeHGGE4J3VQZyXX2UBS40wxUCOXIq9XYxsXLgZWq04J+mhOe8q5lN8qoqb8QYjW2uNjcnVEdm6eVu1CohWBP+llLzQZsqt8mnmljlKnbWI4NYhTqj6AfmQ6tGRtMfHRhHEbd96WHq7BzLbHxueAUio2OLy3H9qxfDuito9Xj8/OjahxxEZQhNJroe2+bV/pf+q9dernHUhO2uDSS+6G46W1K2Sdi0P6t3tock7y23/WynNtls4pbGPItzBWO5bc+tmPUIJuBGrHJyg3OVx02IqULBU7/ICSZnI2uaFJeepHHVyM2aNfKyV2vw976OjhO5p9ALfxQ46oV0IwD1zyo9SC/XhVn98UdLwzfrwmhPBEldDmNwFqhLE/oQxGbYXuaUiO2UJUc6hIvZP7f5ma5nG3eop6MxzCGhmXJbI5nntGEGrGpcRn6q11+hqD8hVgODJI/rfq49NJOqWZsTH59g/44tT3b8Av+bo9L55Ed1HZ9dzaWJ1HevWOV958h+5BpIuj6WngamAlyNVPz8snTgAwdtlVchOzrN6+Cpz2VCAxGlqoxlSa5k20UFUonMdO2tGSTY3eDvCIhfxFEp+HMnFpsXkeOkCY1rirUKFl/3DImMgLz7kZ9knfdyHeUx2e1/DMu7LSqc5unxiE1vyWhmpRrT8vZaDIc9JMCLq99A/IuvVbHzTeHWs3m5unTyuy9eKYKOKVJxVt4jXanUWOd5ifQzMbmlSe82We/dpQSrDb3ew17mp9S841y23aUbo/dhtGG1A5Tplb7ixprDsB23oWdWFvUKquzz2ENuIC6Gz+qLTh8x0izlexWM+GdFhufo66eA2SG+Pn2o4b06StohmFz9PCsH4RMwEVvszR9pukg4EleIPR6M42iptrWdxQ0w6gpu9UZTSPXi/yXh8lyvl7Pb0bfUz/qeQ3Q/Nxo5lGT3HYxU+h6kVCvkZkj9jRjzeZkYbrbalVqOkfp8WkktZTbQdD2jU9DqTmHQPOaAtQKam25OU7jid0pMTMX2wHg6n6Qv03tnOs4t1ow26+6tYKasze4puxpH7RU+0Kr7aht66y//8X0D1ariNDz/d7/B9Uhq5e/VXOc7ZdFoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAp1Lv0H5KqNg70jQj0AAAAASUVORK5CYII=",
  },
  {
    name: "Bộ y tế Việt Nam",
    description:
      "Hợp tác trong việc xây dựng chính sách y tế và quản lý dịch bệnh.",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt9f277N4Uee1EvlKcK9w5f-wPKu6FZZid_g&s",
  },
];

function Partner() {
  useEffect(() => {
    document.title = "Đối tác | HealthTrust";
  }, []);
  return (
    <div className="max-w-5xl mx-auto p-4 relative">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Đối tác của Health Trust
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner, index) => (
          <div
            key={index}
            className="p-4 border rounded shadow hover:shadow-lg transition duration-300 flex flex-col items-center text-center"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="w-24 h-24 object-cover rounded-full mb-4"
            />
            <h2 className="text-lg font-semibold text-blue-600">
              {partner.name}
            </h2>
            <p className="text-gray-700 text-sm mt-2">{partner.description}</p>
          </div>
        ))}
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <DiseaseDetectButton />
      </Suspense>
    </div>
  );
}

export default Partner;

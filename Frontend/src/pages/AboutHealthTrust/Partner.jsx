import { useEffect } from "react";
import DiseaseDetectButton from "../../components/DiseaseDetectButton";

const partners = [
    {
        name: "Bệnh viện Đa khoa Quốc tế Vinmec",
        description: "Hợp tác trong việc nghiên cứu và phát triển công nghệ y tế tiên tiến.",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbMOTKCX23wAP098EuU8pmY33o3QY-xTen6A&s"
    },
    {
        name: "Hello Bác sĩ",
        description: "Cung cấp nền tảng tư vấn sức khỏe trực tuyến và thông tin y tế.",
        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAwFBMVEX///9Ojf8yW5H+/v9NjP////3///xCh/6ev/zK3fsxWpHB1P07g/////rj7Pzd6PvG2PsgUYs/hf1Rj/pDh/sdTokpVY3m7vqyzPpIivtXkvrH0d/x9Pf3+frq8fkzgPvO3/pyofqlwvl8qPhjmPqNs/qltcqVp8E9Y5aInLp2pfnl6vAVSog/dMd6kbPZ4Oi6x9dee6RqnPmIr/mqxfiXufmtu81ogqhPb5xjf6iQo7/Q2uR8pOxCgeg3Zag6a7WtoOosAAAN+0lEQVR4nO1dC0PquBIutNNKIUAflBZarKggwhUfqBzdvfv//9VN2gJtElQ4DafczbfneNRCyJeZTGYyk6yiSEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhI/NsByRdQVaAfqKDiB/gPfgr00zOBCijqN5q+3x0hpLLPUdRp+qtmo48QcB5XH4D64xuboGVcd3T2cTN7aj/7IW8EqgzcXRWFL5duLYN7OUZFTYTo/lLbPLbt14gZgooD9IaD+W051ForlH+s6Ncuebh5gTtog5JN2/MA8gMtRxB/4+YVFZBv1HLQasEgBjJ1/1yXDwA2kLpv12pFCu41KNvJBuFAywmYIHDYuVpRYCJ6fFnTigQwhfZOQNB0azS0QXQmJhWvfaHD9L9WM/wNQ7z+pbOwCPcenYeSYjP6anAY2hd6JiJsZwYsQfyKWD8PitB3ahwCxivsGDo8htrVecxEFY3ZSZbIcCOgfTKs2Z0/2vOfQoVnroCM7nZFVNELdxCMC11RzsDa9HkqqNWc/laGKnR5DDXtKlLOwZ7G3N4btzsR4vXwhjcK2iA8Cxli+dDdxz8Ho5ydBL1r86yRMzoLY9o06M5rWnAZF+wkoNVlrcaS7OvVjxVVwpCGPYgR9TrUDDjajOfq+THEDuhgPKIJYns6egkYIbbhPGRI9dv2WV8FiKYya0bed60sOFraaug85QO4oF+JGVbflHIZ8iSD1wyGYe0sGWqEIVf5WIZap/rT8ACGKsvQ7VSfoGSYf+W/lOH/k6WRDL/8kATpFuupFft0MlTVP7OFLJihmsiPcCPQEzeW/OaEVIUyBLI/gB1aFPXbcbfZbHbjTj9CSCfETzWFRTPUUdjxX56dwHUNw3XdwLl58TuhfroMnSiGye+xUsa3A9cuRC+aYRuD23irsKIhaMVPcjYoXA0uk/doBOkeQfqv0XIuQgSnSO0IkyGg8DXgbaZvYLi3fXQCz10IQxIvRyuHk+zIPiN5oLnORcRsJpSO8rWUkAa9c0Ul7LiwnzskYS50Ov4GQ23vPAS0coMaZ2+Oen+tFthj0fvmxzPUuBEw8cpQeN3SmITkHpb2s+C6h9+SYdBmXonXctR+5qY5+FKsuU5faA7rt+Yhd68NtW9+SHDziWIT5iUzxEo6cg4jKJpi2TJEocNuHH9PsY2E2ZuSGerhT+dg4SMDJxTmp5bKEFSdn0vVyCK/+Y+H4J7oqRAHp1wZohWTyPoh7JWoyo5yGfYDTudTf9toYdh0jmTXlCvK2pTJENANzTAl5NrO/avfbTT8i3vHNnYPci/UbiIxM7FEhqA3W6wAcaQU3DbCbBdDhyi+dbiSNMZi1LQ8hqBwa6uC4LaNdFJhnH2ervfHAUebNWckxJ6WyFBfMeEEFiCOHujmQG9fGayiurdIRERcIsOQrivCP15eID39mCJHNGZHQ7NDEdtTpTFUOSWcmusDMNukyd4i4pTo2GMR8XBZDFUlei4GTPgn19+zyOFZibqsojpRhbUUIGash3GB9rkphCJdT4djxUaVtRS9MnUMSQHqXqmo6Jp+h3srIK1RmgwRUx7nflExleyFjwa02J1R2fxKZNihHxpj2g0jR25yzSm0bcJrS1y+mpbGsNiMpgXBLiAiRfGQFhflCGAX4YayNSL8mtIYUmGT5r7u7CiZXdFwMp08hspunxu7N5SPoBnXekVlCAoa0M8KBcTw5i16Vm9hTaPcMQ0YFeoi8bcC3O+SZAgRbfqf822E74t63azjv9ZduLWvWHWvArrFsgmWJUNot2rFBNOtvlNHeLdMwg+TNL11uHMTYEw1acQVZahATAVORhN2opr06qkI65ho70PJjuNgGTZs+m2VZdhtFWcU2fDfFCiodwm7DKY5z8irWPQ2ZUxXVV3xSfBbYBj0d20Me/U8epPdojEq+LKaiOWCqS89kqHfKjaS907eigyth92qGBUXRM24KJtgaVrqFy1Ncphhw2Nq5ZW07m0Z4oDEORuG1BaNltfSiVWQoZeTYRhQDMelM2Rq9Y+3NIVGcpamOA9NMg+37lybWkaNlQCG3RIYgs6Y/a6+5RHVzYIM5zt3LqbXw/JXC8KwBEsDHUpLsVu6e2tBTa3Zlp8KK/ErflkMQ+qZmz+6F/2ysiUf2xnitmVvAv2eShUHIo7DdUuJLXAAXByooL97K4TrRaaoljWHra/DerODkP7YyjCE4pYEWbv1XTQLytRbWJa1sGZRrhSK2Z5z70UkL0pi6FPNaE6UawZHu4/T2ccbCSy2DitEz1S2LTnRWFWGHboZ2//GAUs3FAswuiJyFyUxpP0v7NaEVDP0j+ypRjHH/UphiIP8F/ocI8lD7PtQkqmhz5BrmvtS/ibGAQw5Z2by+6V6I6D3sG1/P0UVdOoaA/xeuykk+1QSQyWk0qPYiARdfiKC0EAdurAPh1y0XleLIefUuxY0EL9+HVDMHrAu+EEVZKizNxdomt3k5WZI6ilgy24uBR1JZUw2/3TedwxB0Xm3T9gvIX1ek1zXdGuzd42417qYmuEunVVvxdxlVwWGQSF/qMAo4NTLBAM/1DdXaaW5w6jJJCzS1gRVYzAyxCYQgDngCyoro4KWqorOJnZrJKq9GfcjyKBHo/Ezt3jYeBVUUMMyrAU+IKbKDEUrZp5RtRgqGgSMfSRn+233+dWPO/1O3Hy9cm1emQJ2uoUd7mduHNCS0+rUlECNwGZGPujnJY3NBP9+Bi05gkAKhlotUjvMKa7VArsrrD6xwd44UAsuG0XDra+YkSf9HFHKjC64dy+kjeb/YR4ar7qwswkxW4pGNCtfuKvqXZfXOexGFouiILrfX5q4OXHBfXYjIoWfdl7pcKeF+5KPfaIbblHhICyMO/4WjY4oLyVKKvBUuDriXa+jFbxqPWZvByHdIjsVxaEH1P7JKQQaRkPkuQu2YCCB6+/UFK8T3IuixqDSNldFHYO32H1NsCv0Ui3EXm5Sy9JjWacVuOIMArYOnG0jVeV5nF9Aw0FTV+zpIEiCAqZTxvVmZqgAnDUa94x7ExaOFOPBIZXQWhCj3N6NCCCSTWcZ3u7u+kLcq6ToFWXLEfVvfl4qHAzS0lmhQgSm8LVGypLTz1TxVNOvOT3euy+G3Td4sTXewl4UHrHP9kukgOjTljz7lyQeYFMCo/uMlmouXiq4454V5g14ikHDCLjRlQCOzL2IeCWIlK3qkEvrqAHQHOYaogJNfXTrfjcb3eCFvepHENLbPfNIrwwMPx+Hc2xLSVhR3Epz4i83jYjsO/cucer3Kavr3senOGG56VEcpH6Zlnap9YpUZf5gLhYL69cn2bvNrfnENf9+8FUddV7snDubHqtMW9Fs+75DLvo51YFu7EBHF7uwxrUv8PSYLLw0G7aYYopXuafOvrrRHJJZDJGPoyU6OeHa9pU/AmKoTnbphEq2Fvqrq8A2DMMOrnHwpEx65ianuZiAjvwbgzy03SufnFH+zryrSa0XIDRq/vV3fho7f//V7AOiitxOAkBRu7sar5ptpKuw3KU1zbq3xHMxiv3xeNVtwwFn6cnQKW+W+d9//pPin/+avceU/In5JZ+nZlsNZPwfrKS+Z1s+QW4PSM9MHNJq8uIPr1ht8pg+E8Dim97klUYN78xCanqeG/JDI9VfFMNhST0+GOnMSJd5ZemZ+ex77+3oQYcIN0Uq2szsi7UstdvHAWDp5Qma3q+jzQIMF3kJYorzUvt6JNSlWdTSo7ulKrOCkprmnYhM9uGY3xVLRKy349oBJawX4T0J25I5BKCuKRmayuEmhjSkfPSocpqH8rt7FN69IsPF41ErdH5dzYzWpPzOHgWqoNA019GhTUBSHuzVixwXnyK6ezhgSWtpb3poE0TkW99vBzFp0EMBSvTkUT3LfJEDGlGV4kqxmYaVuOQN0uLsohiHyoHr/mOPUlHsxR86ToKAR3luUr3DPw2zG+V+RBPgzWNUtG5V53+pALNi4WvicE0yc/NdMRD5Es4slqA3+/qdpwOOCuaLukl3cfGUaere6Cfdu8J/hneWSa8U9SQOOy2T/VCVD4vuHwn4149haif3lwNh+b1tqxGLOjpTTrc18x1UCFkR4F941t3DcL7VVjV7cXIvYoJoPnyoW/QymL79bl6VSagkInrkTCQyITHJX7O35TyM1HxMqUbhfPk4e7rrcSwM4Wv2jvRuBQEH9DOOnqbd9axez7x7en+YTacTjOl09vC+vjN7PYteR3M6+lAdFSUgNbxrTnfNnQEyPc+yMFfMy7K8NNKtc+xLCu8uqhZDMsvmvN7mLaxJf8eY3xzBavhrBZBYf7/SHQTTWy+rR5Bo6rDOMxuHw1rPq0iQGNTPOpHi77JcvFdQRVOoSvjU2289fgbPmhAvoUJr4RbJnb/wYXnm0XI0TdN6Wv6BS6B/isTJHK65a/8P2JGUgDdJDiFUUYIJ0jhh6qUHew4m6vXekx3g6hJMASQWSjYk9q93Remlf73Fr88/kaI4AthKzKd3iwNWDqyePe/hM9PzswA52fNetzKSjMKaBfcGmxfvaUo2ypmyqaoivVsd5pMnQjKXW+QxxJN2PV2SOpIzkV4R8+HH2losepZJe6jkyoTeYmGtZ8M5bAbl/JBIBZbDyex9XfeSwAKz6i1wfIHDqdlkmHpnkBRmnqEIVchqgsj3EQl5l5+fw+Hw85MExOnNJOlu3NnMPx42G4oshWzinTE3CQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQmJP4L/ARh0/acfj9Q8AAAAAElFTkSuQmCC"
    },
    {
        name: "Bệnh viện Chợ Rẫy",
        description: "Hợp tác trong việc nâng cao chất lượng dịch vụ y tế và đào tạo nhân lực.",
        logo: "https://lh4.googleusercontent.com/proxy/aQ3d-o9oF5Uy1j7FuT2WRL47-jPpck2_yISdght6kAY5gY3QBy2o53uqACLNxupMwIBumNNLKTN9MoXxCo1vYRL1LvlGXUqreA"
    },
    {
        name: "Đại học Y Dược TP.HCM",
        description: "Đào tạo và nghiên cứu chuyên sâu về lĩnh vực y tế cộng đồng.",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuRdp-5TDYIBcQDhoqw8AcaYap1oTxuvGd5A&s"
    },
    {
        name: "Đại học Y Hà Nội",
        description: "Hợp tác trong nghiên cứu và phát triển các giải pháp y tế mới.",
        logo: "https://medw.vn/wp-content/uploads/2024/10/ao-blouse-dai-hoc-y-ha-noi-medw-1.jpg"
    },
    {
        name: "WHO (Tổ chức Y tế Thế giới)",
        description: "Hợp tác phát triển chương trình chăm sóc sức khỏe toàn diện.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_WHO.svg/1200px-Flag_of_WHO.svg.png"
    },
];

function Partner() {
    useEffect(() => {
        document.title = "Đối tác - Health Trust";
    }, []);
    return (
        <div className="max-w-5xl mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-6 text-blue-700">Đối tác của Health Trust</h1>

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
                        <h2 className="text-lg font-semibold text-blue-600">{partner.name}</h2>
                        <p className="text-gray-700 text-sm mt-2">{partner.description}</p>
                    </div>
                ))}
            </div>

            <DiseaseDetectButton />
        </div>
    );
}

export default Partner;

'use client'
import React from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const goBackHome = async () => {
        router.push("/"); // Redireciona após login bem-sucedido
    };

    return (
        <div className="h-[100vh] bg-[url('/bg_login.png')] bg-cover bg-center flex flex-col items-center justify-center">

            <div className="md:w-1/2 w-full bg-black shadow-[#3C153F] shadow-lg rounded-3xl px-12 py-5 flex flex-col gap-4 justify-center items-center drop-shadow-[0_35px_35px_rgba(255,255,255,0.20)]">

                <h1 className="text-3xl font-bold text-green-400">🎉 Pagamento Confirmado!</h1>
                <p className="text-2xl text-gray-300 mt-2 flex gap-2 items-center">Obrigado por assinar o
                    <svg width="300" height="100" viewBox="0 0 1166 325" xmlns="http://www.w3.org/2000/svg">
                        <path d="M169.348 47.6682C180.698 45.7639 189.348 35.8921 189.348 24C189.348 10.7451 178.602 0 165.348 0C152.093 0 141.348 10.7451 141.348 24C141.348 35.8921 149.997 45.7639 161.348 47.6682V142.299C157.105 143.01 153.24 144.835 150.063 147.462L112.873 113.439C113.431 112.053 113.739 110.54 113.739 108.955C113.739 102.327 108.366 96.9547 101.739 96.9547C95.1111 96.9547 89.7385 102.327 89.7385 108.955C89.7385 115.582 95.1111 120.955 101.739 120.955C103.859 120.955 105.851 120.405 107.58 119.439L144.827 153.514C143.224 156.15 142.114 159.12 141.627 162.294H113.166C111.615 157.463 107.085 153.967 101.739 153.967C96.392 153.967 91.8622 157.463 90.3109 162.294H47.7208C45.9532 150.783 36.0062 141.967 24 141.967C10.7451 141.967 0 152.712 0 165.967C0 179.222 10.7451 189.967 24 189.967C35.7773 189.967 45.5732 181.484 47.6108 170.294H90.5426C92.2788 174.783 96.6368 177.967 101.739 177.967C106.84 177.967 111.198 174.783 112.934 170.294H141.737C142.814 176.211 146.061 181.372 150.623 184.921L118.084 224.285C116.658 223.688 115.093 223.358 113.45 223.358C106.822 223.358 101.45 228.73 101.45 235.358C101.45 241.985 106.822 247.358 113.45 247.358C120.077 247.358 125.45 241.985 125.45 235.358C125.45 233.298 124.931 231.359 124.016 229.665L157.826 188.764C158.964 189.14 160.141 189.432 161.348 189.635V277.201C149.997 279.105 141.348 288.977 141.348 300.869C141.348 314.124 152.093 324.869 165.348 324.869C178.602 324.869 189.348 314.124 189.348 300.869C189.348 288.977 180.698 279.105 169.348 277.201V189.635C173.629 188.917 177.525 187.065 180.719 184.4L213.737 219.048C213.222 220.386 212.94 221.839 212.94 223.358C212.94 229.985 218.312 235.358 224.94 235.358C231.567 235.358 236.94 229.985 236.94 223.358C236.94 216.73 231.567 211.358 224.94 211.358C222.767 211.358 220.729 211.935 218.971 212.945L185.947 178.29C187.453 175.777 188.513 172.966 189.016 169.967H217.639C219.287 174.628 223.732 177.967 228.957 177.967C234.181 177.967 238.626 174.628 240.274 169.967H282.349C284.254 181.318 294.126 189.967 306.018 189.967C319.273 189.967 330.018 179.222 330.018 165.967C330.018 152.712 319.273 141.967 306.018 141.967C294.126 141.967 284.254 150.616 282.349 161.967H240.274C238.626 157.306 234.181 153.967 228.957 153.967C223.732 153.967 219.287 157.306 217.639 161.967H189.016C188.251 157.409 186.201 153.286 183.252 149.984L206.369 108.923C206.656 109.022 206.95 109.111 207.25 109.189C213.661 110.869 220.219 107.033 221.899 100.622C223.578 94.2111 219.743 87.6523 213.332 85.9729C206.921 84.2933 200.362 88.1292 198.682 94.5402C197.822 97.8262 198.41 101.151 200.051 103.838L176.915 144.933C174.599 143.657 172.05 142.752 169.348 142.299V47.6682Z" fill="white" />
                        <path d="M194.409 37.5762L194.467 37.5897C201.919 39.3298 209.2 41.7346 216.224 44.775L224.714 25.1636L224.651 25.1365C220.994 23.5553 217.277 22.1218 213.51 20.839C212.621 20.5365 211.73 20.2424 210.836 19.9567C207.023 18.7383 203.161 17.6729 199.258 16.7634L194.409 37.5762Z" fill="white" />
                        <path d="M87.6017 60.536L87.6171 60.5243C101.778 49.7084 118.041 41.9668 135.365 37.7947L130.361 17.0183C126.461 17.9575 122.607 19.0519 118.808 20.2971C106.707 24.2631 95.1627 29.7596 84.4561 36.653C81.1112 38.8064 77.8481 41.0962 74.6754 43.5183L74.6276 43.5547L87.6017 60.536Z" fill="white" />
                        <path d="M278.607 64.8185C281.225 67.8606 283.714 71.0001 286.069 74.2286C296.234 88.1636 303.911 103.755 308.758 120.309C309.88 124.144 310.851 128.031 311.666 131.961L290.741 136.299L290.736 136.275C286.323 115.011 276.576 95.2189 262.409 78.7588L278.607 64.8185Z" fill="white" />
                        <path d="M288.535 197.279C282.426 218.792 270.789 238.329 254.784 253.948C238.778 269.566 218.962 280.721 197.306 286.302L202.639 306.996L202.645 306.995C206.53 305.993 210.364 304.838 214.139 303.534C234.917 296.356 253.905 284.664 269.709 269.243C285.513 253.821 297.666 235.125 305.35 214.529C306.745 210.791 307.992 206.99 309.088 203.135L309.093 203.118L288.535 197.279Z" fill="white" />
                        <path d="M129.201 307.286C125.306 306.315 121.461 305.19 117.674 303.915C96.7461 296.871 77.5895 285.257 61.6224 269.86C45.6554 254.463 33.3533 235.741 25.5526 215.083C24.141 211.345 22.8768 207.543 21.7649 203.686L42.2991 197.767C48.5173 219.337 60.2968 238.894 76.4564 254.477C92.6108 270.054 112.575 281.113 134.349 286.546L134.37 286.551L129.201 307.286Z" fill="white" />
                        <path d="M40.0988 135.612L40.111 135.555C42.3282 125.17 45.8285 115.102 50.5311 105.581L31.3707 96.1171C29.5956 99.7108 27.9673 103.371 26.489 107.09C24.8674 111.169 23.4263 115.317 22.1698 119.523C21.0245 123.357 20.0326 127.239 19.1975 131.159L40.0988 135.612Z" fill="white" />
                        <path d="M56.6571 96.8549C69.912 96.8549 80.6571 86.1097 80.6571 72.8549C80.6571 59.6 69.912 48.8549 56.6571 48.8549C43.4022 48.8549 32.6571 59.6 32.6571 72.8549C32.6571 86.1097 43.4022 96.8549 56.6571 96.8549Z" fill="white" />
                        <path d="M248.94 72C262.195 72 272.94 61.2549 272.94 48C272.94 34.7451 262.195 24 248.94 24C235.685 24 224.94 34.7451 224.94 48C224.94 61.2549 235.685 72 248.94 72Z" fill="white" />
                        <path d="M385.549 213.435C385.122 213.435 384.738 213.307 384.397 213.051C384.141 212.709 384.013 212.325 384.013 211.899V125.371C384.013 124.944 384.141 124.603 384.397 124.347C384.738 124.005 385.122 123.835 385.549 123.835H400.525C400.952 123.835 401.293 124.005 401.549 124.347C401.89 124.603 402.061 124.944 402.061 125.371V211.899C402.061 212.325 401.89 212.709 401.549 213.051C401.293 213.307 400.952 213.435 400.525 213.435H385.549ZM475.238 124.859C475.665 124.176 476.262 123.835 477.03 123.835H492.006C492.433 123.835 492.774 124.005 493.03 124.347C493.371 124.603 493.542 124.944 493.542 125.371V211.899C493.542 212.325 493.371 212.709 493.03 213.051C492.774 213.307 492.433 213.435 492.006 213.435H477.03C476.603 213.435 476.219 213.307 475.878 213.051C475.622 212.709 475.494 212.325 475.494 211.899V155.451C475.494 155.109 475.409 154.939 475.238 154.939C475.067 154.939 474.897 155.067 474.726 155.323L461.158 176.571C460.731 177.253 460.134 177.595 459.366 177.595H451.814C451.046 177.595 450.449 177.253 450.022 176.571L436.454 155.323C436.283 155.067 436.113 154.981 435.942 155.067C435.771 155.067 435.686 155.237 435.686 155.579V211.899C435.686 212.325 435.515 212.709 435.174 213.051C434.918 213.307 434.577 213.435 434.15 213.435H419.174C418.747 213.435 418.363 213.307 418.022 213.051C417.766 212.709 417.638 212.325 417.638 211.899V125.371C417.638 124.944 417.766 124.603 418.022 124.347C418.363 124.005 418.747 123.835 419.174 123.835H434.15C434.918 123.835 435.515 124.176 435.942 124.859L455.142 154.683C455.398 155.195 455.654 155.195 455.91 154.683L475.238 124.859ZM546.13 123.707C551.762 123.707 556.711 124.859 560.978 127.163C565.245 129.467 568.53 132.752 570.834 137.019C573.223 141.2 574.418 146.021 574.418 151.483C574.418 156.859 573.181 161.595 570.706 165.691C568.317 169.787 564.903 172.987 560.466 175.291C556.114 177.509 551.079 178.619 545.362 178.619H527.186C526.759 178.619 526.546 178.832 526.546 179.259V211.899C526.546 212.325 526.375 212.709 526.034 213.051C525.778 213.307 525.437 213.435 525.01 213.435H510.034C509.607 213.435 509.223 213.307 508.882 213.051C508.626 212.709 508.498 212.325 508.498 211.899V125.243C508.498 124.816 508.626 124.475 508.882 124.219C509.223 123.877 509.607 123.707 510.034 123.707H546.13ZM543.442 164.155C547.367 164.155 550.525 163.045 552.914 160.827C555.303 158.523 556.498 155.536 556.498 151.867C556.498 148.112 555.303 145.083 552.914 142.779C550.525 140.475 547.367 139.323 543.442 139.323H527.186C526.759 139.323 526.546 139.536 526.546 139.963V163.515C526.546 163.941 526.759 164.155 527.186 164.155H543.442ZM635.348 213.435C634.495 213.435 633.94 213.008 633.684 212.155L629.844 199.611C629.673 199.269 629.46 199.099 629.204 199.099H597.716C597.46 199.099 597.247 199.269 597.076 199.611L593.364 212.155C593.108 213.008 592.553 213.435 591.7 213.435H575.444C574.932 213.435 574.548 213.307 574.292 213.051C574.036 212.709 573.993 212.24 574.164 211.643L601.812 125.115C602.068 124.261 602.623 123.835 603.476 123.835H623.572C624.425 123.835 624.98 124.261 625.236 125.115L652.884 211.643C652.969 211.813 653.012 212.027 653.012 212.283C653.012 213.051 652.543 213.435 651.604 213.435H635.348ZM601.684 184.379C601.599 184.891 601.769 185.147 602.196 185.147H624.724C625.236 185.147 625.407 184.891 625.236 184.379L613.716 146.363C613.631 146.021 613.503 145.893 613.332 145.979C613.161 145.979 613.033 146.107 612.948 146.363L601.684 184.379ZM693.001 214.459C686.345 214.459 680.5 213.179 675.465 210.619C670.43 207.973 666.548 204.304 663.817 199.611C661.086 194.917 659.721 189.499 659.721 183.355V153.787C659.721 147.643 661.086 142.224 663.817 137.531C666.548 132.837 670.43 129.211 675.465 126.651C680.5 124.091 686.345 122.811 693.001 122.811C699.572 122.811 705.332 124.048 710.281 126.523C715.316 128.912 719.198 132.368 721.929 136.891C724.745 141.328 726.153 146.491 726.153 152.379C726.153 153.147 725.641 153.616 724.617 153.787L709.641 154.683H709.385C708.532 154.683 708.105 154.213 708.105 153.275C708.105 148.752 706.697 145.125 703.881 142.395C701.15 139.664 697.524 138.299 693.001 138.299C688.393 138.299 684.681 139.664 681.865 142.395C679.134 145.125 677.769 148.752 677.769 153.275V184.123C677.769 188.56 679.134 192.144 681.865 194.875C684.681 197.605 688.393 198.971 693.001 198.971C697.524 198.971 701.15 197.605 703.881 194.875C706.697 192.144 708.105 188.56 708.105 184.123C708.105 183.184 708.617 182.715 709.641 182.715L724.617 183.355C725.044 183.355 725.385 183.483 725.641 183.739C725.982 183.995 726.153 184.293 726.153 184.635C726.153 190.523 724.745 195.728 721.929 200.251C719.198 204.773 715.316 208.272 710.281 210.747C705.332 213.221 699.572 214.459 693.001 214.459ZM800.212 123.835C800.639 123.835 800.98 124.005 801.236 124.347C801.577 124.603 801.748 124.944 801.748 125.371V137.915C801.748 138.341 801.577 138.725 801.236 139.067C800.98 139.323 800.639 139.451 800.212 139.451H777.3C776.873 139.451 776.66 139.664 776.66 140.091V211.899C776.66 212.325 776.489 212.709 776.148 213.051C775.892 213.307 775.551 213.435 775.124 213.435H760.148C759.721 213.435 759.337 213.307 758.996 213.051C758.74 212.709 758.612 212.325 758.612 211.899V140.091C758.612 139.664 758.399 139.451 757.972 139.451H735.7C735.273 139.451 734.889 139.323 734.548 139.067C734.292 138.725 734.164 138.341 734.164 137.915V125.371C734.164 124.944 734.292 124.603 734.548 124.347C734.889 124.005 735.273 123.835 735.7 123.835H800.212ZM900.968 137.787C900.968 138.213 900.797 138.597 900.456 138.939C900.2 139.195 899.859 139.323 899.432 139.323H857.576C857.149 139.323 856.936 139.536 856.936 139.963V159.803C856.936 160.229 857.149 160.443 857.576 160.443H885.096C885.523 160.443 885.864 160.613 886.12 160.955C886.461 161.211 886.632 161.552 886.632 161.979V174.395C886.632 174.821 886.461 175.205 886.12 175.547C885.864 175.803 885.523 175.931 885.096 175.931H857.576C857.149 175.931 856.936 176.144 856.936 176.571V211.899C856.936 212.325 856.765 212.709 856.424 213.051C856.168 213.307 855.827 213.435 855.4 213.435H840.424C839.997 213.435 839.613 213.307 839.272 213.051C839.016 212.709 838.888 212.325 838.888 211.899V125.371C838.888 124.944 839.016 124.603 839.272 124.347C839.613 124.005 839.997 123.835 840.424 123.835H899.432C899.859 123.835 900.2 124.005 900.456 124.347C900.797 124.603 900.968 124.944 900.968 125.371V137.787ZM912.049 213.435C911.622 213.435 911.238 213.307 910.897 213.051C910.641 212.709 910.513 212.325 910.513 211.899V125.371C910.513 124.944 910.641 124.603 910.897 124.347C911.238 124.005 911.622 123.835 912.049 123.835H927.025C927.452 123.835 927.793 124.005 928.049 124.347C928.39 124.603 928.561 124.944 928.561 125.371V197.307C928.561 197.733 928.774 197.947 929.201 197.947H971.057C971.484 197.947 971.825 198.117 972.081 198.459C972.422 198.715 972.593 199.056 972.593 199.483V211.899C972.593 212.325 972.422 212.709 972.081 213.051C971.825 213.307 971.484 213.435 971.057 213.435H912.049ZM1014.64 214.843C1007.98 214.843 1002.09 213.477 996.971 210.747C991.936 208.016 988.011 204.219 985.195 199.355C982.379 194.405 980.971 188.731 980.971 182.331V154.939C980.971 148.624 982.379 143.035 985.195 138.171C988.011 133.307 991.936 129.552 996.971 126.907C1002.09 124.176 1007.98 122.811 1014.64 122.811C1021.38 122.811 1027.26 124.176 1032.3 126.907C1037.42 129.552 1041.39 133.307 1044.2 138.171C1047.02 143.035 1048.43 148.624 1048.43 154.939V182.331C1048.43 188.731 1047.02 194.405 1044.2 199.355C1041.39 204.304 1037.42 208.144 1032.3 210.875C1027.26 213.52 1021.38 214.843 1014.64 214.843ZM1014.64 199.355C1019.33 199.355 1023.13 197.861 1026.03 194.875C1028.93 191.888 1030.38 187.92 1030.38 182.971V154.811C1030.38 149.861 1028.93 145.893 1026.03 142.907C1023.21 139.835 1019.41 138.299 1014.64 138.299C1009.94 138.299 1006.14 139.835 1003.24 142.907C1000.43 145.893 999.019 149.861 999.019 154.811V182.971C999.019 187.92 1000.43 191.888 1003.24 194.875C1006.14 197.861 1009.94 199.355 1014.64 199.355ZM1080.23 213.435C1079.29 213.435 1078.69 213.008 1078.44 212.155L1055.78 125.499L1055.65 124.987C1055.65 124.219 1056.12 123.835 1057.06 123.835H1072.93C1073.79 123.835 1074.34 124.261 1074.6 125.115L1086.76 177.211C1086.84 177.552 1086.97 177.723 1087.14 177.723C1087.31 177.723 1087.44 177.552 1087.52 177.211L1099.3 125.243C1099.56 124.304 1100.11 123.835 1100.96 123.835H1116.45C1117.39 123.835 1117.99 124.261 1118.24 125.115L1131.04 177.211C1131.13 177.467 1131.26 177.637 1131.43 177.723C1131.6 177.723 1131.73 177.552 1131.81 177.211L1143.59 125.243C1143.84 124.304 1144.4 123.835 1145.25 123.835H1160.36C1161.55 123.835 1162.02 124.389 1161.76 125.499L1140.77 212.155C1140.52 213.008 1139.92 213.435 1138.98 213.435H1123.75C1122.89 213.435 1122.34 213.008 1122.08 212.155L1109.03 156.731C1108.94 156.389 1108.81 156.219 1108.64 156.219C1108.47 156.219 1108.35 156.389 1108.26 156.731L1096.1 212.027C1095.93 212.965 1095.37 213.435 1094.44 213.435H1080.23Z" fill="white" />
                    </svg>.</p>

                <p className="text-gray-400 mt-4">Você agora tem acesso total às funcionalidades premium.</p>


                <div className="flex flex-col gap-1 justify-center items-center">
                    <Button name="Voltar para ImpactFlow" theme="light" function={goBackHome} />
                </div>
            </div>
        </div>
    )
}
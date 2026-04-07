interface RecommendedCompany {
  name: string;
  careersUrl: string;
}

const RECOMMENDED_COMPANIES: RecommendedCompany[] = [
  // Tech Big
  { name: "토스", careersUrl: "https://toss.im/career" },
  {
    name: "카카오",
    careersUrl: "https://careers.kakao.com",
  },
  {
    name: "네이버",
    careersUrl: "https://recruit.navercorp.com",
  },
  {
    name: "라인",
    careersUrl: "https://careers.linecorp.com",
  },
  {
    name: "쿠팡",
    careersUrl: "https://www.coupang.jobs",
  },
  {
    name: "우아한형제들",
    careersUrl: "https://www.woowahan.com/jobs",
  },
  {
    name: "당근",
    careersUrl: "https://about.daangn.com/jobs",
  },
  {
    name: "야놀자",
    careersUrl: "https://careers.yanolja.com",
  },
  {
    name: "직방",
    careersUrl: "https://careers.zigbang.com",
  },
  {
    name: "무신사",
    careersUrl: "https://www.musinsacareers.com",
  },
  // Fintech / Finance
  {
    name: "토스증권",
    careersUrl: "https://career.tossinvest.com",
  },
  {
    name: "토스뱅크",
    careersUrl: "https://career.tossbank.com",
  },
  {
    name: "카카오뱅크",
    careersUrl: "https://recruit.kakaobank.com",
  },
  {
    name: "카카오페이",
    careersUrl: "https://recruit.kakaopay.com",
  },
  {
    name: "두나무",
    careersUrl: "https://dunamu.career.greetinghr.com",
  },
  {
    name: "빗썸",
    careersUrl: "https://careers.bithumb.com",
  },
  // E-commerce / Lifestyle
  {
    name: "11번가",
    careersUrl: "https://careers.11stcorp.com",
  },
  {
    name: "마켓컬리",
    careersUrl: "https://kurly.career.greetinghr.com",
  },
  {
    name: "오늘의집",
    careersUrl: "https://bucketplace.career.greetinghr.com",
  },
  {
    name: "지그재그",
    careersUrl: "https://career.zigzag.kr",
  },
  // Mobility
  {
    name: "쏘카",
    careersUrl: "https://socar.career.greetinghr.com",
  },
  {
    name: "타다",
    careersUrl: "https://www.tada.global/career",
  },
  // Content / Game
  {
    name: "넥슨",
    careersUrl: "https://careers.nexon.com",
  },
  {
    name: "엔씨소프트",
    careersUrl: "https://careers.ncsoft.com",
  },
  {
    name: "크래프톤",
    careersUrl: "https://careers.krafton.com",
  },
  {
    name: "넷마블",
    careersUrl: "https://recruit.netmarble.com",
  },
  // Edu / SaaS
  {
    name: "리멤버",
    careersUrl: "https://career.rememberapp.co.kr",
  },
  {
    name: "원티드랩",
    careersUrl: "https://www.wantedlab.com/career",
  },
  {
    name: "스푼라디오",
    careersUrl: "https://spoonradio.career.greetinghr.com",
  },
  {
    name: "센드버드",
    careersUrl: "https://sendbird.com/careers",
  },
];

export { RECOMMENDED_COMPANIES };
export type { RecommendedCompany };

// WeatherAPI.com API 키
const API_KEY = '91b70eb115e741c8b4321057250806';
const BASE_URL = 'http://api.weatherapi.com/v1';

// DOM 요소들
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const weatherInfo = document.getElementById('weatherInfo');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');

// 날씨 정보 표시 요소들
const cityName = document.getElementById('cityName');
const country = document.getElementById('country');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');
const forecastContainer = document.getElementById('forecastContainer');
const currentTime = document.getElementById('currentTime');
const currentDate = document.getElementById('currentDate');

// 이벤트 리스너 등록
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// 페이지 로드 시 서울 날씨 표시
window.addEventListener('load', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000); // 1초마다 시간 업데이트
    searchWeatherByCity('Seoul');
});

// 현재 시간과 날짜 업데이트
function updateDateTime() {
    const now = new Date();
    
    // 시간 포맷팅
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    };
    currentTime.textContent = now.toLocaleTimeString('ko-KR', timeOptions);
    
    // 날짜 포맷팅
    const dateOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
    };
    currentDate.textContent = now.toLocaleDateString('ko-KR', dateOptions);
}

// 날씨 검색 함수
async function searchWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        showSweetAlert('warning', '입력 오류', '도시명을 입력해주세요.');
        return;
    }
    
    // 도시명 정규화 (한글 도시명을 영어로 변환)
    const normalizedCity = normalizeCityName(city);
    await searchWeatherByCity(normalizedCity);
}

// 도시명 정규화 함수
function normalizeCityName(city) {
    const cityMap = {
        '서울': 'Seoul',
        '부산': 'Busan',
        '대구': 'Daegu',
        '인천': 'Incheon',
        '광주': 'Gwangju',
        '대전': 'Daejeon',
        '울산': 'Ulsan',
        '세종': 'Sejong',
        '수원': 'Suwon',
        '고양': 'Goyang',
        '용인': 'Yongin',
        '창원': 'Changwon',
        '성남': 'Seongnam',
        '부천': 'Bucheon',
        '안산': 'Ansan',
        '안양': 'Anyang',
        '평택': 'Pyeongtaek',
        '시흥': 'Siheung',
        '김포': 'Gimpo',
        '광명': 'Gwangmyeong',
        '군포': 'Gunpo',
        '오산': 'Osan',
        '하남': 'Hanam',
        '이천': 'Icheon',
        '안성': 'Anseong',
        '의왕': 'Uiwang',
        '양평': 'Yangpyeong',
        '여주': 'Yeoju',
        '과천': 'Gwacheon',
        '포천': 'Pocheon',
        '동두천': 'Dongducheon',
        '가평': 'Gapyeong',
        '연천': 'Yeoncheon',
        '춘천': 'Chuncheon',
        '원주': 'Wonju',
        '강릉': 'Gangneung',
        '동해': 'Donghae',
        '태백': 'Taebaek',
        '속초': 'Sokcho',
        '삼척': 'Samcheok',
        '정선': 'Jeongseon',
        '제천': 'Jecheon',
        '보은': 'Boeun',
        '옥천': 'Okcheon',
        '영동': 'Yeongdong',
        '증평': 'Jeungpyeong',
        '진천': 'Jincheon',
        '괴산': 'Goesan',
        '음성': 'Eumseong',
        '단양': 'Danyang',
        '청주': 'Cheongju',
        '충주': 'Chungju',
        '제주': 'Jeju',
        '서귀포': 'Seogwipo',
        '전주': 'Jeonju',
        '익산': 'Iksan',
        '정읍': 'Jeongeup',
        '남원': 'Namwon',
        '김제': 'Gimje',
        '완주': 'Wanju',
        '진안': 'Jinan',
        '무주': 'Muju',
        '장수': 'Jangsu',
        '임실': 'Imsil',
        '순창': 'Sunchang',
        '고창': 'Gochang',
        '부안': 'Buan',
        '광주': 'Gwangju',
        '나주': 'Naju',
        '목포': 'Mokpo',
        '여수': 'Yeosu',
        '순천': 'Suncheon',
        '광양': 'Gwangyang',
        '담양': 'Damyang',
        '곡성': 'Gokseong',
        '구례': 'Gurye',
        '고흥': 'Goheung',
        '보성': 'Boseong',
        '화순': 'Hwasun',
        '장흥': 'Jangheung',
        '강진': 'Gangjin',
        '해남': 'Haenam',
        '영암': 'Yeongam',
        '무안': 'Muan',
        '함평': 'Hampyeong',
        '영광': 'Yeonggwang',
        '장성': 'Jangseong',
        '완도': 'Wando',
        '진도': 'Jindo',
        '신안': 'Sinan',
        '포항': 'Pohang',
        '경주': 'Gyeongju',
        '김천': 'Gimcheon',
        '안동': 'Andong',
        '구미': 'Gumi',
        '영주': 'Yeongju',
        '영천': 'Yeongcheon',
        '상주': 'Sangju',
        '문경': 'Mungyeong',
        '경산': 'Gyeongsan',
        '군위': 'Gunwi',
        '의성': 'Uiseong',
        '청송': 'Cheongsong',
        '영양': 'Yeongyang',
        '영덕': 'Yeongdeok',
        '청도': 'Cheongdo',
        '고령': 'Goryeong',
        '성주': 'Seongju',
        '칠곡': 'Chilgok',
        '예천': 'Yecheon',
        '봉화': 'Bonghwa',
        '울진': 'Uljin',
        '울릉': 'Ulleung',
        '창녕': 'Changnyeong',
        '양산': 'Yangsan',
        '밀양': 'Miryang',
        '거제': 'Geoje',
        '통영': 'Tongyeong',
        '사천': 'Sacheon',
        '김해': 'Gimhae',
        '진주': 'Jinju',
        '거창': 'Geochang',
        '합천': 'Hapcheon',
        '하동': 'Hadong',
        '산청': 'Sancheong',
        '함양': 'Hamyang',
        '거창': 'Geochang',
        '합천': 'Hapcheon',
        '하동': 'Hadong',
        '산청': 'Sancheong',
        '함양': 'Hamyang',
        '남해': 'Namhae',
        '사천': 'Sacheon',
        '통영': 'Tongyeong',
        '거제': 'Geoje',
        '밀양': 'Miryang',
        '양산': 'Yangsan',
        '창녕': 'Changnyeong',
        '울릉': 'Ulleung',
        '울진': 'Uljin',
        '봉화': 'Bonghwa',
        '예천': 'Yecheon',
        '칠곡': 'Chilgok',
        '성주': 'Seongju',
        '고령': 'Goryeong',
        '청도': 'Cheongdo',
        '영덕': 'Yeongdeok',
        '영양': 'Yeongyang',
        '청송': 'Cheongsong',
        '의성': 'Uiseong',
        '군위': 'Gunwi',
        '경산': 'Gyeongsan',
        '문경': 'Mungyeong',
        '상주': 'Sangju',
        '영천': 'Yeongcheon',
        '영주': 'Yeongju',
        '구미': 'Gumi',
        '안동': 'Andong',
        '김천': 'Gimcheon',
        '경주': 'Gyeongju',
        '포항': 'Pohang'
    };
    
    // 한글 도시명이 있으면 영어로 변환, 없으면 원래 입력값 반환
    return cityMap[city] || city;
}

// 도시명으로 날씨 검색
async function searchWeatherByCity(city) {
    showLoading();
    
    try {
        // 현재 날씨와 3일 예보 데이터 가져오기
        const [currentWeather, forecast] = await Promise.all([
            fetchCurrentWeather(city),
            fetchForecast(city)
        ]);
        
        displayWeather(currentWeather, forecast);
        hideError();
        
        // 성공 알림
        showSweetAlert('success', '날씨 정보 로드 완료', `${city}의 날씨 정보를 성공적으로 가져왔습니다.`);
        
    } catch (err) {
        console.error('날씨 정보 가져오기 실패:', err);
        const errorMessage = err.message || '날씨 정보를 가져올 수 없습니다.';
        showError(errorMessage);
        showSweetAlert('error', '오류 발생', errorMessage);
    }
}

// 현재 날씨 데이터 가져오기
async function fetchCurrentWeather(city) {
    const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error && errorData.error.code === 1006) {
            throw new Error('도시를 찾을 수 없습니다. 정확한 도시명을 입력해주세요.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message || '날씨 정보를 가져올 수 없습니다.');
    }
    
    return data;
}

// 3일 예보 데이터 가져오기
async function fetchForecast(city) {
    const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=3&aqi=no&alerts=no`);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error && errorData.error.code === 1006) {
            throw new Error('도시를 찾을 수 없습니다. 정확한 도시명을 입력해주세요.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message || '날씨 정보를 가져올 수 없습니다.');
    }
    
    return data;
}

// 날씨 정보 표시
function displayWeather(currentData, forecastData) {
    const current = currentData.current;
    const location = currentData.location;
    
    // 현재 날씨 정보 표시
    cityName.textContent = location.name;
    country.textContent = `${location.country}`;
    temperature.textContent = Math.round(current.temp_c);
    weatherDescription.textContent = current.condition.text;
    
    // 날씨 아이콘 설정
    setWeatherIcon(current.condition.code, current.is_day);
    
    // 상세 정보 표시
    feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${current.wind_kph} km/h`;
    visibility.textContent = `${current.vis_km} km`;
    
    // 예보 정보 표시
    displayForecast(forecastData.forecast.forecastday);
    
    hideLoading();
    showWeatherInfo();
}

// 날씨 아이콘 설정
function setWeatherIcon(code, isDay) {
    const iconMap = {
        1000: isDay ? 'fas fa-sun text-yellow-400' : 'fas fa-moon text-blue-400', // 맑음
        1003: isDay ? 'fas fa-cloud-sun text-yellow-400' : 'fas fa-cloud-moon text-blue-400', // 구름 조금
        1006: 'fas fa-cloud text-gray-400', // 구름 많음
        1009: 'fas fa-cloud text-gray-500', // 흐림
        1030: 'fas fa-smog text-gray-500', // 안개
        1063: 'fas fa-cloud-rain text-blue-400', // 가벼운 비
        1066: 'fas fa-snowflake text-blue-300', // 가벼운 눈
        1069: 'fas fa-cloud-rain text-blue-400', // 가벼운 비/눈
        1087: 'fas fa-bolt text-yellow-400', // 천둥번개
        1114: 'fas fa-snowflake text-blue-300', // 가벼운 눈
        1117: 'fas fa-snowflake text-blue-200', // 폭설
        1135: 'fas fa-smog text-gray-500', // 안개
        1147: 'fas fa-smog text-gray-600', // 짙은 안개
        1150: 'fas fa-cloud-rain text-blue-400', // 가벼운 이슬비
        1153: 'fas fa-cloud-rain text-blue-400', // 이슬비
        1180: 'fas fa-cloud-rain text-blue-400', // 가벼운 비
        1183: 'fas fa-cloud-rain text-blue-500', // 비
        1186: 'fas fa-cloud-rain text-blue-500', // 중간 비
        1189: 'fas fa-cloud-rain text-blue-600', // 강한 비
        1192: 'fas fa-cloud-rain text-blue-700', // 매우 강한 비
        1195: 'fas fa-cloud-rain text-blue-800', // 폭우
        1225: 'fas fa-snowflake text-blue-200', // 폭설
        1255: 'fas fa-snowflake text-blue-300', // 가벼운 눈
        1273: 'fas fa-bolt text-yellow-400', // 가벼운 비/천둥번개
        1276: 'fas fa-bolt text-yellow-500' // 강한 비/천둥번개
    };
    
    weatherIcon.className = `text-8xl mb-4 ${iconMap[code] || 'fas fa-cloud text-gray-400'}`;
}

// 예보 정보 표시
function displayForecast(forecastDays) {
    forecastContainer.innerHTML = '';
    
    forecastDays.forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('ko-KR', { 
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        
        const maxTemp = Math.round(day.day.maxtemp_c);
        const minTemp = Math.round(day.day.mintemp_c);
        
        forecastItem.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <i class="forecast-icon ${getForecastIcon(day.day.condition.code)}"></i>
            <div class="forecast-temp">${maxTemp}° / ${minTemp}°</div>
            <div class="forecast-desc">${day.day.condition.text}</div>
        `;
        
        // 예보 아이템 클릭 시 상세 정보 표시
        forecastItem.addEventListener('click', () => {
            showForecastDetails(day, date);
        });
        
        forecastContainer.appendChild(forecastItem);
    });
}

// 예보 상세 정보 표시 (SweetAlert)
function showForecastDetails(day, date) {
    const dateStr = date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
    });
    
    const maxTemp = Math.round(day.day.maxtemp_c);
    const minTemp = Math.round(day.day.mintemp_c);
    const avgTemp = Math.round(day.day.avgtemp_c);
    
    Swal.fire({
        title: dateStr,
        html: `
            <div class="text-center">
                <i class="${getForecastIcon(day.day.condition.code)} text-6xl mb-4"></i>
                <p class="text-xl mb-4">${day.day.condition.text}</p>
                <div class="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p class="text-gray-500">최고</p>
                        <p class="text-red-400 font-bold">${maxTemp}°C</p>
                    </div>
                    <div>
                        <p class="text-gray-500">평균</p>
                        <p class="text-yellow-400 font-bold">${avgTemp}°C</p>
                    </div>
                    <div>
                        <p class="text-gray-500">최저</p>
                        <p class="text-blue-400 font-bold">${minTemp}°C</p>
                    </div>
                </div>
                <div class="mt-4 text-sm text-gray-600">
                    <p>습도: ${day.day.avghumidity}%</p>
                    <p>강수 확률: ${day.day.daily_chance_of_rain}%</p>
                </div>
            </div>
        `,
        icon: 'info',
        confirmButtonText: '확인',
        confirmButtonColor: '#3B82F6',
        background: '#1F2937',
        color: '#F9FAFB'
    });
}

// 예보 아이콘 설정
function getForecastIcon(code) {
    const iconMap = {
        1000: 'fas fa-sun text-yellow-400', // 맑음
        1003: 'fas fa-cloud-sun text-yellow-400', // 구름 조금
        1006: 'fas fa-cloud text-gray-400', // 구름 많음
        1009: 'fas fa-cloud text-gray-500', // 흐림
        1030: 'fas fa-smog text-gray-500', // 안개
        1063: 'fas fa-cloud-rain text-blue-400', // 가벼운 비
        1066: 'fas fa-snowflake text-blue-300', // 가벼운 눈
        1069: 'fas fa-cloud-rain text-blue-400', // 가벼운 비/눈
        1087: 'fas fa-bolt text-yellow-400', // 천둥번개
        1114: 'fas fa-snowflake text-blue-300', // 가벼운 눈
        1117: 'fas fa-snowflake text-blue-200', // 폭설
        1135: 'fas fa-smog text-gray-500', // 안개
        1147: 'fas fa-smog text-gray-600', // 짙은 안개
        1150: 'fas fa-cloud-rain text-blue-400', // 가벼운 이슬비
        1153: 'fas fa-cloud-rain text-blue-400', // 이슬비
        1180: 'fas fa-cloud-rain text-blue-400', // 가벼운 비
        1183: 'fas fa-cloud-rain text-blue-500', // 비
        1186: 'fas fa-cloud-rain text-blue-500', // 중간 비
        1189: 'fas fa-cloud-rain text-blue-600', // 강한 비
        1192: 'fas fa-cloud-rain text-blue-700', // 매우 강한 비
        1195: 'fas fa-cloud-rain text-blue-800', // 폭우
        1225: 'fas fa-snowflake text-blue-200', // 폭설
        1255: 'fas fa-snowflake text-blue-300', // 가벼운 눈
        1273: 'fas fa-bolt text-yellow-400', // 가벼운 비/천둥번개
        1276: 'fas fa-bolt text-yellow-500' // 강한 비/천둥번개
    };
    
    return iconMap[code] || 'fas fa-cloud text-gray-400';
}

// SweetAlert 표시 함수
function showSweetAlert(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        confirmButtonText: '확인',
        confirmButtonColor: '#3B82F6',
        background: '#1F2937',
        color: '#F9FAFB',
        timer: icon === 'success' ? 2000 : undefined,
        timerProgressBar: icon === 'success'
    });
}

// 로딩 상태 표시/숨김
function showLoading() {
    loading.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    error.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

// 날씨 정보 표시/숨김
function showWeatherInfo() {
    weatherInfo.classList.remove('hidden');
}

// 에러 표시/숨김
function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');
    loading.classList.add('hidden');
    weatherInfo.classList.add('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

// 페이지 로드 시 환영 메시지
window.addEventListener('load', () => {
    setTimeout(() => {
        Swal.fire({
            title: 'Weather Pro에 오신 것을 환영합니다!',
            text: '실시간 날씨 정보와 예보를 확인해보세요.',
            icon: 'info',
            confirmButtonText: '시작하기',
            confirmButtonColor: '#3B82F6',
            background: '#1F2937',
            color: '#F9FAFB',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }, 1000);
});

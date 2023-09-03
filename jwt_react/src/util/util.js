const SERVER_URL = "http://localhost:8080"
const CODE = {
    RCV_SUCCESS             : "200", // 성공
    
    RCV_ERROR_LOGIN         : "401", // 인증 오류
    RCV_ERROR_AUTH          : "403", // 인증 오류
    RCV_ERROR_DELETE        : "700", // 삭제 오류
    RCV_ERROR_SAVE          : "800", // 저장 오류
    RCV_ERROR_VALIDATION    : "900", // 입력 오류

    MODE_CREATE         : "create", // 등록 모드
    MODE_MODIFY         : "modify", // 수정 모드 
    MODE_READ           : "read",   // 읽기 모드
    MODE_REPLY          : "reply",  // 답글 모드

    DATE_YEAR           : "year",
    DATE_MONTH          : "month",
    DATE_DATE           : "date",
    DATE_WEEK           : "week",
    DATE_DAY            : "day",
}

export function requestFetch(url, requestOptions, handler, errorHandler) {
    // console.groupCollapsed("requestFetch");
    console.log("requestFetch [URL] : ", SERVER_URL + url);
    console.log("requestFetch [requestOption] : ", requestOptions);

    // Login 했을경우 JWT 설정
    const sessionUser = sessionStorage.getItem('loginUser');
    const sessionUserId = JSON.parse(sessionUser)?.id || null;
    const token = sessionStorage.getItem('token') || null;
    // if(sessionUserId != null && sessionUserId !== undefined){
        if( !requestOptions['headers'] ) requestOptions['headers']={}
        if( !requestOptions['headers']['Authorization'] ) requestOptions['headers']['Authorization']=null;
        requestOptions['headers']['Authorization'] = 'Bearer ' + token;
    // }
    

    //CORS ISSUE 로 인한 조치 - origin 및 credentials 추가 
    // origin 추가
    // if (!requestOptions['origin']) {
    //     requestOptions = { ...requestOptions, origin: SERVER_URL };
    // }
    // credentials 추가 
    // if (!requestOptions['credentials']) {
    //     requestOptions = { ...requestOptions, credentials: 'include' };
    // }

    console.log(url, requestOptions.headers['Authorization'])
    fetch(SERVER_URL + url, requestOptions)
    .then(response => {
        console.log(response, requestOptions);
        return response;
    })
    .then(resp => {// response Stream. Not completion object
        //console.log("requestFetch [Response Stream] ", response); 
        console.log(resp.status, CODE.RCV_ERROR_LOGIN)
        if (Number(resp.status) === Number(CODE.RCV_ERROR_LOGIN)) {

            fetch(SERVER_URL + "/refreshToken", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    token: sessionStorage.getItem("token"),
                    refreshToken: sessionStorage.getItem("refreshToken")
                })
            })
            .then(resp => resp.json())
            .then(resp => {
                                            console.log(resp)
                                            sessionStorage.setItem("token", resp.token);
                                            requestOptions['headers']['Authorization'] = 'Bearer ' + sessionStorage.getItem("token");
                                            fetch(SERVER_URL + url, requestOptions)
                                            .then(resp => resp.json())
                                            .then(resp => {
                                                console.log("requestFetch [response] ", resp);
                                                if (typeof handler === 'function') {
                                                    handler(resp);
                                                } else {
                                                    console.log('egov fetch handler not assigned!');
                                                }
                                            })
                                            .catch(e => console.error(e))
                                            .finally(() => console.log("finally"));
            })
            .catch(e => {
                alert("다시 로그인 해주세요");
                // window.location.href = "/";
            })
            .finally(() => console.log("refresh finally"));
            // alert("Login Alert"); //index.jsx라우터파일에 jwtAuthentication 함수로 공통 인증을 사용하는 코드 추가로 alert 원상복구
            // sessionStorage.setItem('loginUser', JSON.stringify({"id":""}));
            // window.location.href = "/";
            return false;
        } else if (Number(resp.status) === Number(CODE.RCV_ERROR_AUTH)) {
            alert("Login Alert"); //index.jsx라우터파일에 jwtAuthentication 함수로 공통 인증을 사용하는 코드 추가로 alert 원상복구
            sessionStorage.setItem('loginUser', JSON.stringify({"id":""}));
            window.location.href = URL.LOGIN;
            return false;
        } else {
            return resp.json();
        }

        // return response.json();
    })
    .then((resp) => {
        // if (Number(resp.status) === Number(CODE.RCV_ERROR_AUTH)) {
        //     alert("Login Alert"); //index.jsx라우터파일에 jwtAuthentication 함수로 공통 인증을 사용하는 코드 추가로 alert 원상복구
        //     sessionStorage.setItem('loginUser', JSON.stringify({"id":""}));
        //     window.location.href = URL.LOGIN;
        //     return false;
        // } else {
        //     return resp;
        // }
        console.log(resp)
        return resp;
    })
    .then((resp) => {
        if (typeof handler === 'function') {
            handler(resp);
        } else {
            console.log('egov fetch handler not assigned!');
        }
    })
    .catch(error => {
        console.error('There was an error!', error);
        if (error === 'TypeError: Failed to fetch') {
            alert("서버와의 연결이 원활하지 않습니다. 서버를 확인하세요.");
        }

        if (typeof errorHandler === 'function') {
            errorHandler(error);
        } else {
            console.error('egov error handler not assigned!');
            alert("ERR : " + error.message);
        }
    })
    .finally(() => {
        console.log("requestFetch finally end");
        // console.groupEnd("requestFetch");
    });
}
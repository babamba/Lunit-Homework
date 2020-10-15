# Lunit HomeWork

김진원 - 프론트엔드 과제전형 저장소

React(TS) / Antd / Mobx 로 개발 진행.

해당 repository 가 담고 있는 source code 에 대한 설명

    ├── build                   # yarn build 를 통해 나온 컴파일된 결과물.
    ├── node_modules            # npm을 통한 라이브러리 들이 관리되는 폴더.
    ├── public                  # 가상 DOM이 구현되는 실제 DOM 파일이 들어가는 html파일이 있는 폴더.
    ├── src                     # 소스 파일
    │   │ ├── aseet                     # 이미지, config, custom css가 위치한 폴더.
    │   │ ├── component                 # 페이지에서 사용한 컴포넌트들이 위치할 폴더(Root Component 포함).
    │   │ ├── hooks                     # 함수형 컴포넌트를 위한 Helper Hook 들이 위치한 폴더.
    │   │ ├── interface                 # 인터페이스 정의에 대한 파일이 위치한 폴더
    │   │ ├── pages                     # 컴포넌트를 사용할 한 Route 페이지에 대한 파일이 위치한 폴더.
    │   │ ├── route                     # 클라이언트의 라우터정보를 가진 파일이 위치한 폴더.
    │   │ └── stores                    # 클라이언트의 state 관리, API호출등 기능을 하는 mobx Store가 위치한 폴더.
    │   │ │     └── store       # 비즈니스로직을 이용하여 observable을 관리하는 파일이 위치한 폴더(서비스 카테고리 별)
    │   │ │     └── index.js    # store를 combine 하는 RootStore Class
    │   │
    │   └── index.js            # public에 있는 index.html 의 id가 root인 곳에 가상돔을 render하는 파일.
    │
    │
    ├── .env                    # 환경변수에 대한 정보들이 있는 파일.(development : 개발환경 , production : 배포환경)
    ├── .gitignore              # 커밋제외할 것들에 대한 명세서.
    ├── config-overrides.js     # CRA(create-react-app)을 Eject하지않고 Rewired(over-ride)하기 위해 있는 설정 파일.(mobx 사용 및 antd, alias 등 설정)
    └── package.json            # 어플리케이션의 패키지에 관한 정보와 의존중인 버전에 관한 정보를 담고있는 파일.

### 구현 목록

- 어플리케이션 구현
- 도형목록과 캔버스 컴포넌트 구현
- LocalStorage를 이용한 CRUD 액션함수 구현

### 미구현 목록 및 오류

- n개의 도형이 겹쳐져있는 체크하는 부분
- 도형을 merge 시 시계반대방향으로 그린 도형의 겹쳐지는 부분이 그대로 노출되는 오류

### Package Manager

- yarn 사용.

### 실행 방법

1. yarn 혹은 npm install 을 통해 package.json에 명시된 dependency package 설치.
2. yarn start 를 통해 로컬서버 동작.

### 개발환경 node version

- v12.18.3

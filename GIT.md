# SoleConfig Git 관리

- 계정: Song-Sungyoub
- 공개 저장소: https://github.com/Song-Sungyoub/SoleConfig
- 로컬: 복제한 SoleConfig 저장소 폴더
- 기본 브랜치: main

## 빌드

.NET 8 SDK에서 `dotnet build ConfigEditor.csproj -c Release -r win-x64`로 빌드한다. `./build.ps1 -Portable`은 배포 폴더를 생성하고 `./Installer/Build.ps1`은 MSI를 만든다. SoleStore 프로젝트 참조는 없으며 포함된 CPython 실행 환경과 라이선스는 유지한다.

## 버전과 배포

1.5.0부터 소스와 설치 파일을 공개 GitHub 저장소 및 Releases에서 배포한다. 버전 증가·시험·MSI 생성 후 소스 커밋에 `v1.5.0` 같은 태그를 붙이고 Release에 `SoleConfig-1.5.0-x64.msi`를 첨부한다. 업로드 완료 뒤 asset digest를 확인하고 정식 Latest 릴리즈로 게시한다. 초안·베타는 자동 업데이트 대상이 아니다.

Git 저장소에는 빌드 결과·설치 파일·시험 산출물·개인 설정을 넣지 않는다. 포함된 Python 실행 환경과 라이선스는 빌드 재현에 필요한 의존 파일이다. 업데이트는 이 저장소의 공개 Releases를 조회하며 인증 토큰은 필요하지 않다. 기존 버전 사용자는 전환 MSI를 한 번 직접 설치해야 한다. SolePlan과 SoleStore는 이 저장소 범위가 아니다.

API 규격: https://docs.github.com/en/rest/releases/releases#get-the-latest-release

## 자동 게시

`ConfigEditor.csproj`의 버전과 `RELEASE-NOTES.md`를 함께 수정하여 main에 push하면 GitHub Actions가 Windows에서 MSI를 빌드하고 자체 시험과 업데이트 도우미 시험을 실행한다. 이후 초안 Release에 설치 파일을 첨부하고 업로드된 SHA-256·크기를 확인한 뒤 Latest로 공개한다. workflow 변경과 수동 실행도 지원하며 이미 존재하는 버전은 덮어쓰지 않는다. 실패 시 Actions 로그를 확인한다. 업로드 검증에 실패한 초안은 자동 공개하지 않는다.

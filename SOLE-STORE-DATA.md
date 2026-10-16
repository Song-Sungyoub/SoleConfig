> 과거 내장 SoleStore 설계 기록입니다. 2026-10-16 현재 SoleConfig 내장 연결은 제거했으며 SolePlan 및 공용 SoleStore는 별도로 유지합니다.

# Sole Store 배포 정보

각 앱의 01_Updates/detail_info/app_info.json 파일에서 소개와 버전 목록을 읽는다.
app_info.json은 폴더가 아닌 UTF-8 JSON 파일이다.

구조:
- 01_Updates/제품-버전-x64.msi
- 01_Updates/detail_info/app_info.json
- 01_Updates/detail_info/버전/screenshot-light.png
- 01_Updates/detail_info/버전/screenshot-dark.png

schemaVersion, appId, name, description, releases[]를 사용한다.
releases 항목은 version, installer, sha256, releaseNotes[], screenshots[]를 가진다.
installer는 01_Updates 기준 파일명, screenshots는 detail_info 기준 상대 경로이다.
이미지는 {path, caption} 객체 목록으로 누적한다. 등록되지 않은 캡처는 빈 배열을 유지한다.
기존 소개 파일이나 버전 항목을 자동으로 덮어쓰지 않는다.

스토어 동작:
- 앱 이름·소개 검색과 결과 없음 표시.
- 설치 버전과 배포 버전을 숫자로 비교한다. 문자열 정렬을 사용하지 않는다.
- 업데이트 확인은 목록을 새로 조회하는 동작이며 설치는 별도 사용자 클릭으로 실행한다.
- 현재 실행 앱은 기존 업데이트/재실행 경로를 사용한다.
- 연결 실패를 최신 버전이라는 의미로 표시하지 않는다. 설치된 앱 실행은 유지한다.
- 상세 창은 앱 소개, 선택 버전의 변경 내용·스크린샷을 표시한다.
- 출시 파일과 이미지를 먼저 복사·검증하고 JSON을 임시 파일에서 교체하여 마지막에 게시한다.
- 상대 경로의 상위 폴더 이탈·외부 URL·절대 경로를 허용하지 않는다.
- 공유 JSON에는 실행 명령을 저장하지 않는다. 앱 ID와 설치 경로는 클라이언트의 허용 목록을 사용한다.
- JSON 오류나 일부 이미지 누락은 앱별로 처리하여 전체 목록을 막지 않는다.

현재 HTML은 검색·업데이트 상태·상세 창 흐름을 보여주는 목업이다.
공유 폴더 실시간 읽기, 실제 설치 버전 조회와 이미지 로딩은 WPF 구현 단계에서 연결한다.
초기 메타데이터는 현재 배포 폴더의 실제 MSI를 기반으로 작성하며 과거 변경 내용은 추측하지 않는다.

## Store 운영 문서

업로드·자동 업데이트·다운로드 집계·리뷰·인기순 상세 정책은 [Sole Store 운영 및 데이터 설계](SOLE-STORE-OPERATIONS.md)를 따른다. 공유 배포본은 04_SoleStore/docs/OPERATIONS.md에 둔다.

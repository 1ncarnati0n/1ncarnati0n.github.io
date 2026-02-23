---
title: "`/bin`"
date: 2024-01-01
tags: []
draft: false
---

루트 디렉토리(`/`) 아래에는 수많은 디렉토리들이 있는데요. 그중에서 알아두면 좋은 디렉토리 몇 개를 살펴볼 겁니다. 노트를 읽어보시면서 각 디렉토리 안에 어떤 것들이 있는지 살펴보셔도 재미있을 겁니다.

`ls [-al] [PATH]`

# `/bin`

bin은 'binaries'의 약자인데요. binary는 간단히 말해서 컴퓨터가 실행할 수 있는 프로그램을 뜻합니다. 여기서 중요한 사실을 하나 알려드릴게요. 우리가 커맨드를 입력하면 마법같이 어떤 동작이 일어나는데요. 커맨드도 결국 어떤 프로그램입니다. 커맨드를 입력하면 커맨드에 해당하는 프로그램이 실행되는 거죠. 그리고 그 프로그램들의 일부는 바로 이 `/bin` 디렉토리 안에 있습니다.

`ls -l /bin`

![](https://bakey-api.codeit.kr/api/files/resource?root=static&seqId=4906&directory=bin1.png&name=bin1.png) ![](https://bakey-api.codeit.kr/api/files/resource?root=static&seqId=4906&directory=bin2.png&name=bin2.png)

`/bin` 디렉토리의 내용을 살펴보면, `ls` 같은 파일들이 보이죠? `ls` 커맨드를 입력하면 `/bin` 안에 있는 `ls` 프로그램이 실행되는 겁니다.

# `/sbin`

sbin은 bin과 비슷한데, 관리자 전용 프로그램들이 있습니다.

# `/etc`

etc에는 컴퓨터 설정 파일들이 있는데요. 각종 프로그램의 설정 파일, 관리자 권한 설정 파일 같은 것들이 있습니다.

# `/home` 또는 `/Users`

`/home`(리눅스) 또는 `/Users`(맥 OS) 디렉토리에는 사용자들의 홈 디렉토리가 있습니다. 사용자의 홈 디렉토리는 사용자의 모든 파일을 저장해 놓는 곳입니다.

사실 맥 OS에도 `/home` 디렉토리가 있기는 한데요. 이 디렉토리는 사용되지 않습니다. 안을 확인해 보셔도 아무 파일도 없을 거에요.

# `/usr`

usr은 사용자(user)에게 필요한 파일들을 저장하고 있습니다. `/usr` 안에도 각종 binary(프로그램 파일)를 저장하고 있는 `bin` 디렉토리가 있는데요. `/bin`에는 컴퓨터가 시작하거나 자신을 수리하기 위해서 꼭 필요한 커맨드들이 있고, `/usr/bin`에는 컴퓨터가 필요하기보다는 사용자가 필요한 커맨드들이 있습니다.

![](https://bakey-api.codeit.kr/api/files/resource?root=static&seqId=4906&directory=usr.png&name=usr.png)

그리고 `/usr` 안에는 `local`이라는 디렉토리도 있는데요. 여기에는 사용자가 직접 설치한 프로그램과 관련된 파일들이 있습니다.

더 알아보고 싶으시다면 아래 링크를 참고.

- [https://www.geeksforgeeks.org/linux-unix/linux-directory-structure/](https://www.geeksforgeeks.org/linux-unix/linux-directory-structure/)
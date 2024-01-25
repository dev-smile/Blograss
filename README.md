# Blograss : 블로그로 잔디를 심어보자

## 1. Blograss란 무엇인가요?

> Blograss는 마크다운을 사용하는 블로거들을 위해 개발된 도구입니다. <br>
> 이 도구는 일명 "GitHub 잔디"와 유사한 형태로 블로깅 활동을 시각적으로 나타내줍니다.
>
> Blograss를 통해, 여러분이 얼마나 자주 블로그 글을 작성하거나 업데이트하는지를 시각적으로 매력적이고 이해하기 쉬운 형태로 추적할 수 있습니다.
>
> (현재는 Velog만 지원하고 있습니다.)

## 2. 빠른 시작

[일 별 URL] https://blograss-weld.vercel.app/api?type=daily&name={your-username} <br>
[주 별 URL] https://blograss-weld.vercel.app/api?type=weekly&name={your-username}

> 1.&nbsp;your-username을 Velog 사용자 이름으로 대체합니다. <br>
> 2.&nbsp;URL을 복사하여 마크다운 파일이나 블로그에 이미지 소스로 사용합니다.

## 3. 주요 기능

### 3-1. 일 별 시각화

> Blograss는 일일 블로깅 활동을 시각화할 수 있습니다.

> 이 기능을 사용하려면 URL의 name 파라미터를 사용자 이름으로 변경하세요.

```
https://blograss-weld.vercel.app/api?name=dev-smile

또는

https://blograss-weld.vercel.app/api?type=daily&name=dev-smile
```

예시

[![Blograss](https://blograss-weld.vercel.app/api?name=dev-smile)](https://blograss-weld.vercel.app/api?name=dev-smile)

### 3-2. 주 별 시각화

> 보다 넓은 관점에서 블로깅 활동을 보고 싶다면 주간 시각화를 이용할 수 있습니다.

> 이 기능을 사용하려면 URL의 name 파라미터를 사용자 이름으로 변경하세요.

```
https://blograss-weld.vercel.app/api?type=weekly&name=dev-smile
```

예시

[![Blograss](https://blograss-weld.vercel.app/api?type=weekly&name=dev-smile)](https://blograss-weld.vercel.app/api?type=weekly&name=dev-smile)

### 3-3. 연도 선택

> Blograss는 블로깅 활동을 시각화하고 싶은 특정 연도를 지정할 수 있는 기능도 제공합니다.

> 이 기능을 사용하려면 URL의 year 파라미터를 원하는 연도로 조정하세요

```
- 일 별
https://blograss-weld.vercel.app/api?name=dev-smile&year=2023

- 주 별
https://blograss-weld.vercel.app/api?type=weekly&name=dev-smile&year=2023
```

[![Blograss](https://blograss-weld.vercel.app/api?name=dev-smile&year=2023)](https://blograss-weld.vercel.app/api?name=dev-smile&year=2023)

[![Blograss](https://blograss-weld.vercel.app/api?type=weekly&name=dev-smile&year=2023)](https://blograss-weld.vercel.app/api?type=weekly&name=dev-smile&year=2023)

### 3-4. 블로그 유형 선택 (Beta)

> Velog와 Naver 중 블로그 플랫폼을 선택할 수 있는 기능을 제공합니다. (베타 버전, 현재 조회 방식의 한계로 Naver는 최신 50개 글까지만 조회 가능)

> 이 기능을 사용하려면, URL의 blogType 파라미터를 velog 또는 naver로 조정하세요

```
- Velog
https://blograss-weld.vercel.app/api?name=dev-smile&blogType=velog

- Naver
https://blograss-weld.vercel.app/api?name=dev-smile&blogType=naver
```

---
title: "5. tsconfig.json"
date: 2024-01-01
tags: []
draft: false
---


## **자주 사용되는 옵션**

프로젝트를 만들 때 `tsc --init` 명령어로 `tsconfig.json` 파일을 생성했습니다. 아래와 같은 파일이 생성되었는데요. 이번 레슨에서는 이 파일에서 사용할 수 있는 옵션들에 대해서 좀 더 자세히 살펴보겠습니다.

```json

{
  "compilerOptions": {
    "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "module": "commonjs",                                /* Specify what module code is generated. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
    "strict": true,                                      /* Enable all strict type-checking options. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}

```


<br>

## **꼭 알아야 할 컴파일러 옵션들**

`compilerOptions`에서 사용할 수 있는 옵션 중에서 중요한 것들을 살펴보겠습니다.

### **`target`: 어떤 ECMAScript 버전으로 변환할지**

타입스크립트 코드는 빌드해서 자바스크립트로 변환하는데요. 이때 변환할 자바스크립트의 버전을 정할 수 있습니다. 만약에 프로젝트가 과거 자바스크립트 표준만 지원하는 브라우저까지 지원해야 한다면, 여기서 오래된 버전을 설정할 수 있죠. 2023년 현재를 기준으로 `tsconfig.json`을 생성했을 때는, 기본적으로는 ES7(ES2016)으로 변환하도록 되어있습니다. 여기다가 ES6(ES2015)나 ES3 등을 설정해 줄 수 있습니다.

코드를 실행할 브라우저나 Node.js 환경에 따라 선택하시면 되는데요. 브라우저의 경우 ES5는 거의 모든 브라우저에서 지원하고, ES6는 인터넷 익스플로러를 제외하면 대부분의 브라우저에서 지원합니다. Node.js의 경우 v14 이후 버전을 쓰신다면 ES5, ES6를 대부분 지원합니다.

잘 모르겠다면 일단은 ES6로 설정해 두고 쓰시는 걸 추천드릴게요. 실행 환경에 따른 문법 지원 여부가 궁금하신 분들은 아래 두 링크를 참고해 보세요.

- ["ECMAScript" | Can I use... Support tables for HTML5, CSS3, etc](https://caniuse.com/?search=ECMAScript)
- [ECMAScript 6 compatibility table (kangax.github.io)](https://kangax.github.io/compat-table/es6/)

### **`module`: 어떤 방식으로 모듈을 만들지**

자바스크립트 모듈에는 크게 두 가지 방식이 있습니다. ES6부터 도입된 import/export 문법을 사용하는 ESM(ECMAScript Module) 방식이 있고요, Node.js 같은 데서 기본적으로 사용하는 CJS(CommonJS) 방식이 있는데요.

이 옵션에서는 자바스크립트 코드로 트랜스파일할 때 어떤 모듈 문법으로 변환할지 선택할 수 있습니다. 다양한 옵션 값을 지원하는데요. ESM을 쓰시려면 `es6`, `es2020` 같이 `es`로 시작하는 값을 쓰면 되고, CJS를 쓰시려면 `commonjs`라고 쓰시면 됩니다.

보통 Node.js 환경에서는 CJS를 사용하고, 프론트엔드 개발을 할 때는 보통 번들러에서 모듈을 알아서 처리해 주기 때문에 ESM, CJS 상관없이 쓰실 수 있을 겁니다. 어떤 걸 선택할지 잘 모르겠다면 `commonjs`로 설정하는 걸 추천드릴게요.

### **`esModuleInterop`: ES 모듈을 안전하게 사용**

ESM 문법에서 `import * as moment from 'moment'`라든가 `import moment from 'moment'`라는 문법은 서로 다른데요. 이 옵션을 `false`로하면 CJS로 변환했을 때 두 코드는 같은 형태의 코드 `const moment = require('moment')`로 변환됩니다. 안전하게 모듈을 사용하려면 `esModuleInterop` 옵션은 `true`로 해놓는 것을 권장드립니다.

[TypeScript: TSConfig Reference - Docs on every TSConfig option (typescriptlang.org)](https://www.typescriptlang.org/tsconfig#esModuleInterop)

### **`forceConsistentCasingInFileNames`: 파일의 대소문자 구분하기**

macOS를 사용하시는 분들은 `main.ts`라는 파일과 `Main.ts`라는 파일이 서로 다른데요. Windows와 같이 어떤 운영체제에서는 종종 `main.ts`라는 파일과 `Main.ts`라는 파일을 동일하게 취급하기도 합니다. 이런 환경에서 개발하더라도 반드시 대소문자 구분을 명확하게 하겠다는 옵션입니다. 이 옵션도 반드시 `true`로 해 놓는 걸 권장드립니다.

### **`strict`: 엄격한 규칙들 켜기**

이 옵션을 켜면 `stict`와 관련된 여러 규칙들을 한꺼번에 켤 수 있는데요. 어떤 옵션들이 켜지는지는 [공식 문서의 strict 옵션](https://www.typescriptlang.org/tsconfig#strict) 설명을 참고해 주세요. 여기서는 그중에서도 대표적으로 알아두면 좋은 것 두 가지를 소개해드리겠습니다.

- `noImplicitAny`: 아무 타입을 직접 정의하지 않고, 타입 추론도 되지 않는 상태를 implicit any라고 하는데요. 쉽게 말해서 기존 자바스크립트 코드처럼 타입 없이 사용하는 걸 implicit any라고 합니다.
    
    ```tsx
    
    function printSize(product) {
                       ~~~~~~~ 타입 정의도 없고 추론할 수도 없음
      console.log(product.size);
    }
    
    ```
    
    새로 시작하는 타입스크립트 프로젝트라면 무조건 켜는 걸 추천드리지만, 기존에 자바스크립트로 만든 프로젝트를 타입스크립트로 옮기는 중이라면 이 옵션을 잠시 끄는 것도 좋습니다. 아래처럼 설정하면 `strict` 규칙들을 한꺼번에 설정하지만 `noImplicitAny`는 설정하지 않을 수 있습니다.
    
    ```tsx
    
    "strict": true,
    "noImplicitAny": false,
    
    ```
    
- `strictNullChecks`: `null`이 될 가능성이 있다면, 이런 경우를 반드시 처리하도록 하는 옵션입니다. 이것도 되도록이면 켜 놓으시는 걸 추천합니다. 예를 들자면 아래와 같은 코드는 strict null check를 할 때는 오류가 납니다. `num` 변수가 `null`이 될 수도 있으니까요. 반면에 `strictNullChecks`가 꺼져있다면 타입 오류가 나지 않습니다. 대신에 실행하는 도중에 `num` 변수에 `null` 값이 들어간다면 런타임 오류가 나겠죠?
    
    ```tsx
    
    let num: number | null;
    // ...
    num -= 1;
    ~~~
    
    ```
    
    되도록이면 `strictNullChecks`를 켜시고, 이런 경우에는 반드시 null check를 하는 걸 권장드립니다.
    
    ```tsx
    
    let num: number | null;
    // ...
    if (num !== null) {
      num -= 1;
    }
    
    ```
    

### **`skipLibCheck`: 설치한 패키지의 타입 검사하지 않기**

`node_modules` 폴더에 설치된 패키지들의 타입 검사를 하지 않는 옵션입니다. 패키지 개발 과정에서 대부분 타입 검사가 이뤄지기 때문에, 중복으로 하지 않아도 됩니다. 그래서 이 옵션을 사용하시길 추천드립니다.

### **`rootDir`: 최상위 폴더**

타입스크립트 컴파일러가 처리할 타입스크립트 파일들의 최상위 폴더를 정하는 옵션입니다. 기본 값으로는 처리하는 파일들의 경로를 종합해서 최상위 폴더를 정합니다. 만약 `tsconfig.json` 파일과 같은 폴더에 있는 `src` 폴더를 최상위 폴더로 정하고 싶다면 아래와 같이 쓰면 됩니다.

```tsx

{
  "compilerOptions": {
    "rootDir": "src",
  }
}

```

### **`outDir`: 자바스크립트 파일을 생성할 폴더**

`outDir`에 지정된 폴더 안에다가 `rootDir`의 디렉토리 구조에 따라서 자바스크립트 파일을 만듭니다. 값을 지정하지 않으면 소스코드 파일과 같은 폴더에 자바스크립트 파일을 만듭니다.

```tsx

{
  "compilerOptions": {
    "outDir": "dist",
  }
}

```

### **`resolveJsonModule`: JSON 파일 임포트하기**

`.json` 파일을 임포트해서 사용하고 싶다면 이 옵션을 켜야 합니다.

```tsx

import data from 'data.json';
// ...

```


<br>


## **`include`와 `exclude`**

`tsc`로 트랜스파일할 때 포함할 경로(`include`)와 포함하지 않을 경로(`exclude`)를 정해줄 수 있습니다. 배열로 경로 패턴을 적어주면 되는데요. `**/*`라는 코드는 아래의 모든 폴더, 모든 파일을 의미합니다. 참고로 이런 패턴을 Glob 패턴이라고 합니다. 혹시 궁금하신 분들은 [위키피디아 Glob 문서](https://ko.wikipedia.org/wiki/%EA%B8%80%EB%A1%9C%EB%B8%8C_\(%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D\))를 참고해 보세요.

```tsx

{
  "compilerOptions": {
    "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "module": "commonjs",                                /* Specify what module code is generated. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
    "strict": true,                                      /* Enable all strict type-checking options. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["bin/**/*"],
}

```

<br>

## **그 밖의 옵션들 활용하기**

옵션이 너무 많기 때문에 모든 옵션들을 전부 알고 있을 필요는 없습니다. 그 밖의 다른 옵션들이 궁금하신 분들은 [타입스크립트 공식 문서](https://www.typescriptlang.org/tsconfig)를 참고하시는 걸 추천드립니다.

참고로 VS Code에서는 옵션들을 자동완성 기능으로 작성할 수 있는데요. 무엇을 작성해야 할지 모를 때 Windows에서는 `Ctrl` + `I`, macOS에서는 `Cmd` + `I`를 입력하면 Suggestion이 뜹니다. 각 옵션에 대한 설명도 볼 수 있으니까 공부 목적이 아니라 프로젝트를 개발할 때는 이 기능을 활용하시는 걸 추천합니다.

<br>

## **tsconfig.json 불러오기**

`tsconfig.json` 파일을 매번 설정하는 건 귀찮기도 하고, 만약에 여러 프로젝트를 개발한다면 항상 똑같은 설정을 쓰고 싶을 겁니다. 이럴 때 매번 복사/붙여넣기 하는 건 유지 보수하는데 좋지 않겠죠.

이럴 때 사용할 수 있는 옵션이 바로 `extends`입니다. 아래와 같이 `extends` 옵션으로 원하는 설정 파일의 경로를 적어주면 `tsconfig.json` 파일을 불러올 수 있습니다. 그리고 추가로 옵션을 사용해서 덮어쓸 수도 있죠.

tsconfig.json
```tsx
{
  "extends": "<설정 파일 경로>"
}
```

### **tsconfig/bases 예시**

예를 들어서 권장하는 `tsconfig.json` 설정들을 모아놓은 [tsconfig/bases](https://github.com/tsconfig/bases) 리포지토리에 있는 설정 파일을 패키지로 설치한 다음, 불러와서 사용해 볼게요.

### **패키지 설치하기**

먼저 패키지를 설치해 줍니다. 타입스크립트 패키지는 개발 환경에서만 사용하기 때문에, `--save-dev` 옵션으로 설치하는 것도 잊지 마세요.

```bash

npm install --save-dev @tsconfig/recommended

```

### **`extends` 설정하기**

`tsconfig.json` 파일의 맨 위에 `extends` 속성을 추가해 줍니다. 기존에 사용하던 옵션은 지워줄게요.

tsconfig.json

```json

{
  "extends": "@tsconfig/recommended/tsconfig.json",
  "compilerOptions": {
  }
}

```

### **옵션 덮어쓰기**

[bases/recommended.json](https://github.com/tsconfig/bases/blob/main/bases/recommended.json) 파일을 살펴보니까 아래와 같은 옵션을 사용하고 있습니다.

bases/recommended.json

```bash

{
  "compilerOptions": {
    "target": "ES2015",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "$schema": "<https://json.schemastore.org/tsconfig>",
  "display": "Recommended"
}

```

저는 `target`을 `ES2016`으로 사용하고 싶어서 이 옵션을 덮어쓰겠습니다.

tsconfig.json
```json
{
  "extends": "@tsconfig/recommended/tsconfig.json",
  "compilerOptions": {
    "target": "ES2016"
  }
}
```

이런 식으로 `extends` 옵션을 사용하면 패키지로 설치한 `tsconfig.json` 파일을 불러올 수도 있고, 직접 만든 `tsconfig.json` 파일을 불러올 수도 있습니다.
# login Mobile App

React Native 기반 모바일 로그인 데모 앱

### 1. 의존성 설치
```bash
npm install
```

> **Note**: `@growgrammers/auth-core`는 npm 레지스트리에 배포되어 있어 `package.json`에 명시된 버전이 자동으로 설치됩니다.

### 2. 실행

```bash
npm ls @growgrammers/auth-core   # 설치 확인
npm start -- --reset-cache       # Metro 캐시 리셋
npm run android                   # Android 실행
npm run ios                       # iOS 실행
```

---

### 3. Android 네이티브 개발 가이드

> **현재 상태**: Mock Bridge로 가상 로그인 구현됨  
> **안드로이드 개발자 작업**: 실제 OAuth 네이티브 로직 구현



#### Android Studio에서 네이티브 OAuth 구현

```bash
# Android Studio에서 android/ 폴더 열기
# File > Open > android/ 선택
```

**작업할 파일:**
- `android/app/src/main/java/com/loginmobileapp/` - 네이티브 OAuth 모듈
- `AndroidManifest.xml` - OAuth redirect URI, 권한 설정
- `build.gradle` - OAuth SDK 의존성 (Google, Kakao, Naver)



#### Mock Bridge → 실제 네이티브 Bridge 전환

네이티브 구현 완료 후, Mock을 비활성화하고 실제 네이티브 코드 연결:

**`src/hooks/useAuthManagers.ts` 수정:**
```typescript
// 변경 전 (Mock 사용)
initializeMockGoogleAuth({
  useMockBridge: true,  // ← Mock 사용 중
  googleClientId: 'mock-client-id-for-development',
})

// 변경 후 (실제 네이티브 사용)
initializeMockGoogleAuth({
  useMockBridge: false,  // ← 실제 네이티브 Bridge 사용
  googleClientId: 'YOUR_REAL_GOOGLE_CLIENT_ID',  // ← 실제 클라이언트 ID
  apiBaseUrl: 'https://your-api-server.com',
})
```

#### 테스트 실행

```bash
# 프로젝트 루트에서
npm run android

# 또는 Android Studio에서 직접 빌드/실행
```

#### 디버깅 팁

```bash
# 네이티브 로그 확인
adb logcat *:E

# React Native 로그 확인
npx react-native log-android
```

**주요 체크 포인트:**
- ✅ `NativeAuthBridge` 모듈이 RN에서 인식되는가?
- ✅ OAuth redirect URI가 AndroidManifest에 등록되었는가?
- ✅ 네이티브에서 이벤트(`auth-status`)가 발생하는가?
- ✅ RN에서 이벤트를 수신하고 화면 전환이 되는가?



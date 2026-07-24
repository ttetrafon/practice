# Android

## Memory

### Cache

- In-Memory cache
  - values assigned in class properties
  - kept as long as the app is running
- Data Store cache
  - kept in a plain-text file
  - persists over multiple app sessions
  - is unique

```kotlin
data class AuthInfo(
  val accessToken: String,
  val refreshToken: String,
  val user: User
)

class DataStoreSessionStorage (private val dataStore: DataStore<Preferences>): SessionStorage {
  private val authInfoKey = stringPreferencesKey("KEY_AUTH_INFO")

  private val json = Json {
    ignoreUnknownKeys = True
  }

  override fun observerAuthInfo(): Flow<AuthInfo> {
    return dataStore.data.map { preferences ->
      val serializedJson = preferences[authInfoKey]
      serializedJson?.let {
        json.decodeFromString<AuthSerializable>(it).toDomain()
      }
    }
  }
}
```

- Database cache
  - caches complex data structure in a DB
- File cache
  - store files in storage, in either of the following locations:
    - `cacheDir`
    - `filesDir`

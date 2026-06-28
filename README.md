
<br />
<p align="center">
  <img src="https://img.shields.io/badge/Java-21-blue?logo=java" alt="Java 21"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1-brightgreen?logo=springboot" alt="Spring Boot 4.1"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/IBM%20Carbon-11-0062FF?logo=ibm" alt="IBM Carbon"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="PostgreSQL 16"/>
  <img src="https://img.shields.io/badge/Gradle-8.x-02303A?logo=gradle" alt="Gradle"/>
</p>

<h1 align="center">İş Süreci Yönetimi (BPM) Dokümantasyon Platformu</h1>
<p align="center"><b>Kurumsal süreçlerin dokümantasyonu, görselleştirilmesi, versiyonlanması ve yönetimi için modern web platformu</b></p>

<p align="center">
  <a href="#türkçe">🇹🇷 Türkçe</a> •
  <a href="#english">🇬🇧 English</a> •
  <a href="#deutsch">🇩🇪 Deutsch</a> •
  <a href="#русский">🇷🇺 Русский</a>
</p>

---

<a name="türkçe"></a>
## 🇹🇷 Türkçe

### 📋 Proje Hakkında

**BPM Dokümantasyon Platformu**, kurumsal iş süreçlerini (workflow) dokümante etmek, görselleştirmek, versiyonlamak ve yönetmek için geliştirilmiş full-stack bir web uygulamasıdır. Akademik ve kurumsal proje kapsamında tasarlanmış olup, modern yazılım mimarisi prensiplerini sergilemektedir.

### ✨ Özellikler

| Özellik | Açıklama |
|---|---|
| **📄 Süreç Yönetimi** | İş akışları oluşturma, düzenleme, listeleme ve soft-delete |
| **🗺️ Süreç Haritalama** | HTML5 Canvas ile görsel akış diyagramı oluşturma ve PNG export |
| **📌 Versiyonlama** | Süreç versiyon geçmişi, değişiklik takibi ve geri yükleme |
| **👥 Rol ve Yetki Yönetimi** | Rol tanımlama, izin atama ve yetki matrisi |
| **📋 İş Kuralı Yönetimi** | If-else tabanlı iş kuralları oluşturma ve yönetme |
| **📝 Aktivite Logları** | Detaylı denetim izi ve süreç geçmişi kaydı |
| **📊 Performans Raporları** | Süreç metrikleri, aksiyon dağılımı ve JSON export |
| **📖 API Dokümantasyonu** | Swagger/OpenAPI ile otomatik endpoint dokümantasyonu |
| **📤 Export Özellikleri** | PNG, JSON formatında dışa aktarım |

### 🛠️ Teknolojiler

#### Backend
- **Java 21** — Modern Java özellikleri
- **Spring Boot 4.1** — RESTful API, Data JPA, Validation
- **Spring Data JPA / Hibernate** — ORM katmanı
- **PostgreSQL 16** — İlişkisel veritabanı
- **Springdoc OpenAPI 2.6** — API dokümantasyonu
- **Gradle** — Derleme ve bağımlılık yönetimi

#### Frontend
- **React 19** — Kullanıcı arayüzü
- **IBM Carbon Design System 11** — UI bileşen kütüphanesi
- **React Router DOM 7** — Sayfa yönlendirme
- **Axios** — HTTP istemcisi
- **Vite 8** — Derleme aracı
- **HTML5 Canvas** — Süreç haritası görselleştirme

### 🏗️ Mimari

```
┌─────────────────────────────────────┐
│         React SPA (Vite)            │
│  IBM Carbon Design System           │
│  Port: 5173                         │
└──────────────┬──────────────────────┘
               │ /api proxy
┌──────────────▼──────────────────────┐
│    Spring Boot REST API             │
│    Port: 8080                       │
│    Controllers → Services → JPA     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         PostgreSQL 16               │
│    processes, process_steps,        │
│    process_versions, roles,         │
│    business_rules, activity_logs    │
└─────────────────────────────────────┘
```

### 🚀 Kurulum

#### Gereksinimler
- JDK 21+
- Node.js 20+
- PostgreSQL 16+

#### Backend
```bash
./gradlew bootRun
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Veritabanı
```sql
CREATE DATABASE bpmdb;
```
Bağlantı: `jdbc:postgresql://localhost:5432/bpmdb`

### 📂 Proje Yapısı

```
src/main/java/com/enterprise/gokalpbildirici/
├── GokalpbildiriciApplication.java
├── model/
│   ├── ProcessDefinition.java
│   ├── ProcessStep.java
│   ├── ProcessVersion.java
│   ├── BusinessRule.java
│   ├── Role.java
│   └── ActivityLog.java
├── repository/
├── service/
│   ├── ProcessService.java
│   ├── BusinessRuleService.java
│   └── RoleService.java
└── controller/
    ├── ProcessController.java
    ├── BusinessRuleController.java
    ├── RoleController.java
    └── LogController.java

frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── ProcessList.jsx
│   │   ├── ProcessDetail.jsx
│   │   ├── ProcessMapping.jsx
│   │   ├── Versioning.jsx
│   │   ├── Roles.jsx
│   │   ├── BusinessRules.jsx
│   │   ├── ActivityLogs.jsx
│   │   └── Reports.jsx
│   └── App.jsx
└── package.json
```

### 📚 API Endpoints

| Method | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/processes` | Süreçleri listele |
| POST | `/api/processes` | Süreç oluştur |
| GET | `/api/processes/{id}` | Süreç detayı |
| PUT | `/api/processes/{id}` | Süreç güncelle |
| DELETE | `/api/processes/{id}` | Süreci pasifleştir |
| GET | `/api/processes/{id}/steps` | Süreç adımlarını listele |
| POST | `/api/processes/{id}/steps` | Adım ekle |
| GET | `/api/processes/{id}/versions` | Versiyon geçmişi |
| POST | `/api/processes/{id}/versions` | Yeni versiyon oluştur |
| GET | `/api/roles` | Rolleri listele |
| POST | `/api/roles` | Rol oluştur |
| GET | `/api/rules` | Kuralları listele |
| POST | `/api/rules` | Kural oluştur |
| GET | `/api/logs` | Aktivite loglarını listele |

Swagger UI: [`http://localhost:8080/swagger-ui.html`](http://localhost:8080/swagger-ui.html)

### 👨‍💻 Geliştirici

**Gökalp Bildirici** — *Full-Stack Developer*

---

<a name="english"></a>
## 🇬🇧 English

### 📋 About The Project

**BPM Documentation Platform** is a full-stack web application built for documenting, visualizing, versioning, and managing enterprise business processes (workflows). Designed as an academic and enterprise project, it demonstrates modern software architecture principles.

### ✨ Features

| Feature | Description |
|---|---|
| **📄 Process Management** | Create, edit, list, and soft-delete workflows |
| **🗺️ Process Mapping** | HTML5 Canvas visual flow diagrams with PNG export |
| **📌 Versioning** | Process version history, change tracking, and restoration |
| **👥 Role & Permission Management** | Role definition, permission assignment, authority matrix |
| **📋 Business Rules Management** | If-else based business rule creation and management |
| **📝 Activity Logs** | Detailed audit trail and process history recording |
| **📊 Performance Reports** | Process metrics, action distribution, JSON export |
| **📖 API Documentation** | Swagger/OpenAPI endpoint auto-documentation |
| **📤 Export Capabilities** | Export to PNG, JSON formats |

### 🛠️ Tech Stack

- **Backend:** Java 21, Spring Boot 4.1, Spring Data JPA, PostgreSQL 16
- **Frontend:** React 19, IBM Carbon Design System 11, Vite 8
- **API:** RESTful, Swagger/OpenAPI

### 🚀 Quick Start

```bash
# Backend
./gradlew bootRun

# Frontend
cd frontend && npm install && npm run dev

# Database
createdb bpmdb
```

### 👨‍💻 Developer

**Gökalp Bildirici** — *Full-Stack Developer*

---

<a name="deutsch"></a>
## 🇩🇪 Deutsch

### 📋 Über das Projekt

**BPM-Dokumentationsplattform** ist eine Full-Stack-Webanwendung zur Dokumentation, Visualisierung, Versionierung und Verwaltung von Unternehmensgeschäftsprozessen (Workflows). Entwickelt als akademisches und unternehmensorientiertes Projekt, das moderne Softwarearchitekturprinzipien demonstriert.

### ✨ Funktionen

| Funktion | Beschreibung |
|---|---|
| **📄 Prozessverwaltung** | Workflows erstellen, bearbeiten, auflisten und soft-delete |
| **🗺️ Prozessabbildung** | HTML5 Canvas Flowchart-Diagramme mit PNG-Export |
| **📌 Versionierung** | Prozessversionsverlauf, Änderungsverfolgung und Wiederherstellung |
| **👥 Rollen- und Berechtigungsverwaltung** | Rollendefinition, Berechtigungszuweisung, Berechtigungsmatrix |
| **📋 Geschäftsregelverwaltung** | If-else-basierte Geschäftsregelerstellung und -verwaltung |
| **📝 Aktivitätsprotokolle** | Detaillierter Prüfpfad und Prozessverlaufsaufzeichnung |
| **📊 Leistungsberichte** | Prozessmetriken, Aktionsverteilung, JSON-Export |
| **📖 API-Dokumentation** | Swagger/OpenAPI Endpunkt-Autodokumentation |
| **📤 Exportfunktionen** | Export in PNG, JSON-Formate |

### 🛠️ Technologiestack

- **Backend:** Java 21, Spring Boot 4.1, Spring Data JPA, PostgreSQL 16
- **Frontend:** React 19, IBM Carbon Design System 11, Vite 8
- **API:** RESTful, Swagger/OpenAPI

### 🚀 Schnellstart

```bash
# Backend
./gradlew bootRun

# Frontend
cd frontend && npm install && npm run dev

# Datenbank
createdb bpmdb
```

### 👨‍💻 Entwickler

**Gökalp Bildirici** — *Full-Stack-Entwickler*

---

<a name="русский"></a>
## 🇷🇺 Русский

### 📋 О проекте

**Платформа документирования BPM** — это полнофункциональное веб-приложение для документирования, визуализации, версионирования и управления корпоративными бизнес-процессами (воркфлоу). Разработано как академический и корпоративный проект, демонстрирующий принципы современной программной архитектуры.

### ✨ Возможности

| Функция | Описание |
|---|---|
| **📄 Управление процессами** | Создание, редактирование, просмотр и мягкое удаление воркфлоу |
| **🗺️ Картирование процессов** | Визуальные диаграммы на HTML5 Canvas с экспортом в PNG |
| **📌 Версионирование** | История версий процессов, отслеживание изменений и восстановление |
| **👥 Управление ролями и правами** | Определение ролей, назначение разрешений, матрица полномочий |
| **📋 Управление бизнес-правилами** | Создание и управление бизнес-правилами на основе if-else |
| **📝 Журналы активности** | Детальная запись аудита и истории процессов |
| **📊 Отчёты производительности** | Метрики процессов, распределение действий, экспорт в JSON |
| **📖 Документация API** | Автоматическая документация через Swagger/OpenAPI |
| **📤 Экспорт** | Экспорт в форматы PNG, JSON |

### 🛠️ Технологический стек

- **Бэкенд:** Java 21, Spring Boot 4.1, Spring Data JPA, PostgreSQL 16
- **Фронтенд:** React 19, IBM Carbon Design System 11, Vite 8
- **API:** RESTful, Swagger/OpenAPI

### 🚀 Быстрый старт

```bash
# Бэкенд
./gradlew bootRun

# Фронтенд
cd frontend && npm install && npm run dev

# База данных
createdb bpmdb
```

### 👨‍💻 Разработчик

**Гёкальп Бильдириджи** — *Full-Stack разработчик*

# 🔐 Guide du Système RBAC - MediNode

## Architecture RBAC (Role-Based Access Control)

### Vue d'ensemble
Le système RBAC de MediNode restreint l'accès aux pages selon le rôle de l'utilisateur. Tous les rôles sont redirigés vers un **seul dashboard** : `/dashboard`, seules les vues accessibles changent.

---

## 📋 Rôles et Permissions

### 1. **ADMIN** - Administrateur système
Accès complet à la plateforme

| Route | Accès |
|-------|-------|
| `/dashboard` | ✅ |
| `/patients` | ✅ |
| `/patients/add` | ✅ |
| `/patients/:id` | ✅ |
| `/records` | ✅ |
| `/records/:id` | ✅ |
| `/consultations` | ✅ |
| `/consultations/add` | ✅ |
| `/centers` | ✅ |
| `/sync` | ✅ |
| `/users` | ✅ |
| `/users/:id` | ✅ |
| `/logs` | ✅ |
| `/security` | ✅ |
| `/settings` | ✅ |

### 2. **DOCTOR** - Médecin
Gestion des patients et dossiers médicaux

| Route | Accès |
|-------|-------|
| `/dashboard` | ✅ |
| `/patients` | ✅ (lecture) |
| `/patients/add` | ❌ |
| `/patients/:id` | ✅ |
| `/records` | ✅ |
| `/records/:id` | ✅ |
| `/consultations` | ✅ |
| `/consultations/add` | ✅ |
| `/centers` | ❌ |
| `/sync` | ❌ |
| `/users` | ❌ |
| `/logs` | ❌ |
| `/security` | ❌ |
| `/settings` | ✅ |

### 3. **RECEPTIONIST** - Réceptionniste
Gestion administrative des patients

| Route | Accès |
|-------|-------|
| `/dashboard` | ✅ |
| `/patients` | ✅ |
| `/patients/add` | ✅ |
| `/patients/:id` | ✅ |
| `/records` | ❌ |
| `/consultations` | ❌ |
| `/centers` | ❌ |
| `/sync` | ❌ |
| `/users` | ❌ |
| `/logs` | ❌ |
| `/security` | ❌ |
| `/settings` | ✅ |

### 4. **PATIENT** - Patient
Accès à son profil et dossiers médicaux

| Route | Accès |
|-------|-------|
| `/dashboard` | ✅ |
| `/patients` | ❌ |
| `/records` | ✅ |
| `/records/:id` | ✅ |
| `/users/:id` | ✅ (profil personnel) |
| `/consultations` | ❌ |
| `/centers` | ❌ |
| `/sync` | ❌ |
| `/users` | ❌ |
| `/logs` | ❌ |
| `/security` | ❌ |
| `/settings` | ✅ |

---

## 🔧 Composants et Hooks

### 1. **AuthContext** - `src/context/AuthContext.jsx`

Gère l'authentification et l'état utilisateur.

```javascript
import { useAuth } from '../context/AuthContext'

export default function MyComponent() {
  const { user, role, token, login, logout, hasRole, isAuthenticated } = useAuth()

  // Vérifier le rôle
  if (hasRole(['admin', 'doctor'])) {
    // Afficher du contenu
  }

  // Se déconnecter
  const handleLogout = async () => {
    await logout()
  }
}
```

**Méthodes disponibles:**
- `user` - Objet utilisateur complet (name, email, role, etc.)
- `role` - Rôle de l'utilisateur (admin, doctor, receptionist, patient)
- `token` - Token JWT pour l'authentification
- `login(email, password)` - Connexion utilisateur
- `logout()` - Déconnexion et nettoyage
- `hasRole(roles)` - Vérifier si l'utilisateur a un rôle (string ou array)
- `isAuthenticated()` - Vérifier si authentifié

### 2. **ProtectedRoute** - `src/components/ProtectedRoute.jsx`

Protège les routes selon les rôles.

```javascript
import ProtectedRoute from './components/ProtectedRoute'

// Dans App.jsx
<Route
  path="/admin-panel"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>

// Accepte plusieurs rôles
<ProtectedRoute allowedRoles={['admin', 'doctor']}>
  <SomePage />
</ProtectedRoute>
```

**Comportements:**
- ✅ Utilisateur autorisé → Affiche le composant
- ❌ Non authentifié → Redirige vers `/login`
- ❌ Rôle non autorisé → Redirige vers `/dashboard` (si authentifié)

### 3. **useAuth Hook**

```javascript
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, role, isAuthenticated } = useAuth()

  if (!isAuthenticated()) {
    return <Navigate to="/login" />
  }

  return (
    <div>
      <h1>Bienvenue, {user.name}</h1>
      <p>Rôle: {role}</p>
    </div>
  )
}
```

---

## 🔄 Flux d'Authentification

```
1. Utilisateur visite /login
   ↓
2. Saisit email + password
   ↓
3. AuthContext.login() → API POST /login
   ↓
4. Backend retourne: { token, user { name, role, ... } }
   ↓
5. AuthContext stocke dans localStorage + state
   ↓
6. Redirection vers /dashboard
   ↓
7. ProtectedRoute vérifie le rôle
   ↓
8. Affiche les données selon les permissions
```

### Restauration de session
- Au chargement de l'app, AuthContext restaure automatiquement:
  - Token depuis localStorage
  - Utilisateur depuis localStorage
  - Rôle depuis user.role

---

## 🛡️ Sécurité

### 1. **Validation côté frontend**
- ProtectedRoute bloque l'accès aux pages non autorisées
- Sidebar masque les liens interdits
- Les URL manuelles redérigent vers /dashboard

### 2. **Validation côté backend** (À IMPLÉMENTER)
```php
// Dans Laravel, ajouter middleware pour valider les rôles
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin-only', [AdminController::class, 'index'])
        ->middleware('role:admin');
});
```

### 3. **Token management**
- Token stocké dans localStorage
- Automatiquement envoyé dans chaque requête (intercepteur axios)
- Invalide → Redirige vers /login (intercepteur api.js)

---

## 📱 Sidebar Dynamique

Le composant Sidebar affiche les items selon le rôle:

```javascript
// En `src/components/Sidebar.jsx`
const navItemsByRole = {
  admin: [ /* tous les items */ ],
  doctor: [ /* items restreints */ ],
  receptionist: [ /* items administratifs */ ],
  patient: [ /* items personnels */ ]
}
```

### Fonctionnalités:
- ✅ Affiche le nom et rôle de l'utilisateur
- ✅ Affiche uniquement les liens autorisés
- ✅ Bouton de déconnexion fonctionnel
- ✅ Initiales de l'utilisateur en avatar

---

## 🚀 Configuration Requise

### Backend (Laravel)
Le backend DOIT retourner cette structure au login:

```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": 1,
    "name": "Dr. Jean Dupont",
    "email": "jean@hospital.fr",
    "role": "doctor"
  }
}
```

### Middleware
Ajouter au backend:
```php
Route::middleware('auth:sanctum')->group(function () {
    // Routes protégées
});
```

---

## 🔍 Vérification du Rôle dans les Composants

### Masquer du contenu
```javascript
import { useAuth } from '../context/AuthContext'

export default function PatientsList() {
  const { hasRole } = useAuth()

  return (
    <div>
      <h1>Patients</h1>
      
      {/* Visible uniquement pour admin et receptionist */}
      {hasRole(['admin', 'receptionist']) && (
        <Button>Ajouter un patient</Button>
      )}
    </div>
  )
}
```

### Redirection conditionnelle
```javascript
const { role, isAuthenticated } = useAuth()

useEffect(() => {
  if (isAuthenticated()) {
    if (role === 'patient') {
      navigate('/records')
    }
  }
}, [role])
```

---

## ⚙️ Déploiement en Production

1. **Vérifier la sécurité**
   - Validation côté backend obligatoire
   - Tokens avec expiration courte (15-30 min)
   - Refresh tokens pour renouveler

2. **Logs d'audit**
   - Logger les accès non autorisés
   - Enregistrer les tentatives de modification

3. **HTTPS**
   - Obligatoire pour localStorage sécurisé
   - Tokens en HTTP-only cookies (idéal)

4. **Tests**
   - Tester chaque rôle
   - Vérifier les redirections
   - Tester la restauration de session

---

## 📚 Fichiers Modifiés

| Fichier | Modification |
|---------|--------------|
| `src/context/AuthContext.jsx` | ✨ NOUVEAU - Gestion auth et rôles |
| `src/components/ProtectedRoute.jsx` | ✨ NOUVEAU - Protection des routes |
| `src/components/Sidebar.jsx` | 🔄 Mise à jour - Dynamique par rôle |
| `src/pages/Login.jsx` | 🔄 Mise à jour - Utilise AuthContext |
| `src/App.jsx` | 🔄 Mise à jour - Routes avec ProtectedRoute |
| `src/main.jsx` | 🔄 Mise à jour - Enveloppe AuthProvider |

---

## 🎯 Résumé

✅ **Un seul dashboard** `/dashboard` pour tous  
✅ **Redirection automatique** après login vers `/dashboard`  
✅ **Vues dynamiques** selon le rôle  
✅ **Sidebar masquée** les liens interdits  
✅ **Sécurité URL** les accès manuels redérigent  
✅ **Persistance** session restaurée au refresh  
✅ **Logout complet** nettoyage localStorage + redirection  

---

## 🐛 Dépannage

### Le rôle ne s'affiche pas
- Vérifier que le backend retourne `user.role`
- Vérifier la console pour les erreurs JSON

### Les routes sont inaccessibles
- Vérifier que `allowedRoles` contient le rôle correct
- S'assurer que le token est valide

### Logout ne fonctionne pas
- Vérifier que `logout()` nettoie bien localStorage
- Vérifier la redirection vers /login

---

**📝 Développé pour la soutenance du Master en Génie Informatique**

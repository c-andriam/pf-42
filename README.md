# Portfolio 42 - c-andriam

Portfolio professionnel présentant mes compétences et projets développés durant mon parcours à l'école 42 Antananarivo.

## 🚀 Aperçu

Ce portfolio présente :
- Mes compétences techniques acquises (C, Unix, Git, etc.)
- Mes projets 42 avec détails et liens GitHub
- Mon parcours scolaire à 42 Antananarivo
- Mes coordonnées et moyens de contact

## 🛠️ Technologies utilisées

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Design**: Inspiré de GitHub (Dark/Light mode)
- **Déploiement**: Vercel
- **Outils**: Git, Service Worker, Responsive Design

## 📁 Structure du projet

```
portfolio-42/
├── public/
│   ├── index.html          # Page principale
│   ├── styles.css          # Styles CSS
│   ├── script.js           # JavaScript
│   ├── sw.js              # Service Worker
│   ├── favicon.ico        # Favicon
│   └── assets/            # Images et ressources
├── vercel.json            # Configuration Vercel
├── package.json           # Métadonnées du projet
└── README.md              # Documentation
```

## 🎨 Fonctionnalités

- ✅ Design responsive (mobile-first)
- ✅ Mode sombre/clair
- ✅ Navigation fluide
- ✅ Animations CSS
- ✅ Service Worker (PWA)
- ✅ SEO optimisé
- ✅ Formulaire de contact
- ✅ Lazy loading des images

## 🚀 Installation et développement

### Prérequis
- Node.js (optionnel pour le serveur de développement)
- Git

### Installation
```bash
# Cloner le repository
git clone https://github.com/c-andriam/portfolio-42.git

# Naviguer dans le dossier
cd portfolio-42

# Installer les dépendances (optionnel)
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible à `http://localhost:3000`

## 🌐 Déploiement sur Vercel

### Méthode 1: Via GitHub (Recommandée)
1. Pusher le code sur GitHub
2. Connecter le repository à Vercel
3. Déploiement automatique à chaque push

### Méthode 2: Via Vercel CLI
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### Méthode 3: Glisser-déposer
1. Aller sur [vercel.com](https://vercel.com)
2. Glisser le dossier `portfolio-42` dans l'interface
3. Configuration automatique

## 📱 Responsive Design

Le site est optimisé pour :
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1200px+)

## 🎯 Performances

- ⚡ Chargement rapide (< 2s)
- 🔄 Service Worker pour la mise en cache
- 📊 Optimisé pour les Core Web Vitals
- 🖼️ Lazy loading des images

## 🔧 Personnalisation

### Modifier les informations personnelles
Éditez les variables dans `script.js` :
```javascript
const personalInfo = {
    name: "c-andriam",
    email: "c-andriam@student.42antananarivo.mg",
    github: "https://github.com/c-andriam",
    linkedin: "https://linkedin.com/in/c-andriam"
};
```

### Ajouter un projet
Dans `index.html`, dupliquez un bloc `.project-card` et modifiez :
- Image du projet
- Titre et description
- Tags et statistiques
- Lien GitHub

### Changer le thème
Modifiez les variables CSS dans `styles.css` :
```css
:root {
    --accent-color: #your-color;
    --text-accent: #your-color;
}
```

## 📧 Contact

- **Email**: c-andriam@student.42antananarivo.mg
- **GitHub**: [github.com/c-andriam](https://github.com/c-andriam)
- **LinkedIn**: [linkedin.com/in/c-andriam](https://linkedin.com/in/c-andriam)

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre feature
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📊 Statistiques

- **Milestone actuel**: 5/10
- **Projets réalisés**: 15+
- **Languages**: C, Shell, JavaScript
- **Outils**: Git, Makefile, GDB, Valgrind

---

*Développé avec ❤️ par c-andriam - École 42 Antananarivo*
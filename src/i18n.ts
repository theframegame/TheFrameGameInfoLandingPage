import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Landing Page
      landing: {
        title: "Turn Screen Time Into Screen Credits",
        subtitle: "Where young filmmakers learn by creating, not just consuming",
        description: "The Frame Game is an arts education platform that empowers kids and teens to become storytellers, filmmakers, and creative thinkers",
      },
      // Signup Form
      signup: {
        title: "Join The Frame Game!",
        selectorLabel: "I am a...",
        nameLabel: "Name (optional)",
        emailLabel: "Email *",
        submitText: "Let's Go! 🚀",
        submitting: "Joining...",
        successMessage: "🎉 Welcome to The Frame Game!",
        selectType: "Please select who you are!",
      },
      // User Types
      userTypes: {
        filmmaker: { label: "Filmmaker", description: "Create amazing content" },
        parent: { label: "Parent", description: "Support your child" },
        educator: { label: "Educator", description: "Teach with us" },
        teen: { label: "Teen", description: "Learn and create" },
        investor: { label: "Investor", description: "Join our journey" },
        donor: { label: "Donor", description: "Support arts education" },
        "just-curious": { label: "Just Curious", description: "Learn more" },
      },
      // Contact Page
      contact: {
        title: "Get In Touch",
        name: "Name",
        email: "Email",
        message: "Message",
        submit: "Send Message",
        submitting: "Sending...",
        success: "Message sent successfully!",
        error: "Failed to send message. Please try again.",
      },
      // Beta Page
      beta: {
        title: "Join the Beta",
        subtitle: "Be among the first to experience The Frame Game",
        apply: "Apply Now",
      },
      // Common
      common: {
        loading: "Loading...",
        error: "An error occurred",
        adminLink: "Admin",
        footerText: "© 2026 The Frame Game. All rights reserved.",
        contactLink: "Contact Us",
        learnMore: "Learn More",
      },
      // Sections
      sections: {
        studioDemoTitle: "Frame Game Studio",
        studioDemoDescription: "Edit like a pro with our intuitive timeline editor",
        dashboardDemoTitle: "Student & Teacher Dashboard",
        dashboardDemoDescription: "Track progress and manage assignments",
        cameraOverlayTitle: "Camera Overlay System",
        cameraOverlayDescription: "Professional framing guides for mobile filming",
        generalInfoTitle: "About The Frame Game",
        generalInfoDescription: "Learn more about our mission and vision",
        betaInfoTitle: "Beta Program",
        betaInfoDescription: "Join our early testing program",
        investorInfoTitle: "Investment Opportunity",
        investorInfoDescription: "Partner with us in revolutionizing arts education",
        parentEducatorInfoTitle: "For Parents & Educators",
        parentEducatorInfoDescription: "Empower the next generation of creators",
      },
      // Admin
      admin: {
        login: "Admin Login",
        password: "Password",
        loginButton: "Login",
        dashboard: "Admin Dashboard",
        logout: "Logout",
        subscribers: "Subscribers",
        contacts: "Contact Submissions",
        emailTemplates: "Email Templates",
        timelines: "Timelines",
        accessControl: "Access Control",
        contentManager: "Content Manager",
        landingPage: "Landing Page",
        settings: "Settings",
        betaApplicants: "Beta Applicants",
      },
    },
  },
  fr: {
    translation: {
      // Landing Page
      landing: {
        title: "Transformez le temps d'écran en crédits d'écran",
        subtitle: "Où les jeunes cinéastes apprennent en créant, pas seulement en consommant",
        description: "The Frame Game est une plateforme d'éducation artistique qui permet aux enfants et aux adolescents de devenir conteurs, cinéastes et penseurs créatifs",
      },
      // Signup Form
      signup: {
        title: "Rejoignez The Frame Game!",
        selectorLabel: "Je suis un...",
        nameLabel: "Nom (optionnel)",
        emailLabel: "Email *",
        submitText: "Allons-y! 🚀",
        submitting: "En cours...",
        successMessage: "🎉 Bienvenue à The Frame Game!",
        selectType: "Veuillez sélectionner qui vous êtes!",
      },
      // User Types
      userTypes: {
        filmmaker: { label: "Cinéaste", description: "Créez du contenu incroyable" },
        parent: { label: "Parent", description: "Soutenez votre enfant" },
        educator: { label: "Éducateur", description: "Enseignez avec nous" },
        teen: { label: "Adolescent", description: "Apprenez et créez" },
        investor: { label: "Investisseur", description: "Rejoignez notre aventure" },
        donor: { label: "Donateur", description: "Soutenez l'éducation artistique" },
        "just-curious": { label: "Simplement Curieux", description: "En savoir plus" },
      },
      // Contact Page
      contact: {
        title: "Contactez-nous",
        name: "Nom",
        email: "Email",
        message: "Message",
        submit: "Envoyer le message",
        submitting: "Envoi...",
        success: "Message envoyé avec succès!",
        error: "Échec de l'envoi du message. Veuillez réessayer.",
      },
      // Beta Page
      beta: {
        title: "Rejoindre la Bêta",
        subtitle: "Soyez parmi les premiers à découvrir The Frame Game",
        apply: "Postuler maintenant",
      },
      // Common
      common: {
        loading: "Chargement...",
        error: "Une erreur s'est produite",
        adminLink: "Admin",
        footerText: "© 2026 The Frame Game. Tous droits réservés.",
        contactLink: "Contactez-nous",
        learnMore: "En savoir plus",
      },
      // Sections
      sections: {
        studioDemoTitle: "Frame Game Studio",
        studioDemoDescription: "Montage professionnel avec notre éditeur de timeline intuitif",
        dashboardDemoTitle: "Tableau de bord étudiants & enseignants",
        dashboardDemoDescription: "Suivez les progrès et gérez les devoirs",
        cameraOverlayTitle: "Système de superposition de caméra",
        cameraOverlayDescription: "Guides de cadrage professionnels pour le tournage mobile",
        generalInfoTitle: "À propos de The Frame Game",
        generalInfoDescription: "En savoir plus sur notre mission et vision",
        betaInfoTitle: "Programme Bêta",
        betaInfoDescription: "Rejoignez notre programme de test précoce",
        investorInfoTitle: "Opportunité d'investissement",
        investorInfoDescription: "Partenaire dans la révolution de l'éducation artistique",
        parentEducatorInfoTitle: "Pour les parents et éducateurs",
        parentEducatorInfoDescription: "Autonomisez la prochaine génération de créateurs",
      },
      // Admin
      admin: {
        login: "Connexion Admin",
        password: "Mot de passe",
        loginButton: "Se connecter",
        dashboard: "Tableau de bord Admin",
        logout: "Déconnexion",
        subscribers: "Abonnés",
        contacts: "Soumissions de contact",
        emailTemplates: "Modèles d'email",
        timelines: "Chronologies",
        accessControl: "Contrôle d'accès",
        contentManager: "Gestionnaire de contenu",
        landingPage: "Page d'accueil",
        settings: "Paramètres",
        betaApplicants: "Candidats bêta",
      },
    },
  },
  es: {
    translation: {
      // Landing Page
      landing: {
        title: "Convierte el tiempo de pantalla en créditos de pantalla",
        subtitle: "Donde los jóvenes cineastas aprenden creando, no solo consumiendo",
        description: "The Frame Game es una plataforma de educación artística que empodera a niños y adolescentes para convertirse en narradores, cineastas y pensadores creativos",
      },
      // Signup Form
      signup: {
        title: "¡Únete a The Frame Game!",
        selectorLabel: "Yo soy un...",
        nameLabel: "Nombre (opcional)",
        emailLabel: "Email *",
        submitText: "¡Vamos! 🚀",
        submitting: "Uniéndose...",
        successMessage: "🎉 ¡Bienvenido a The Frame Game!",
        selectType: "¡Por favor selecciona quién eres!",
      },
      // User Types
      userTypes: {
        filmmaker: { label: "Cineasta", description: "Crea contenido increíble" },
        parent: { label: "Padre/Madre", description: "Apoya a tu hijo" },
        educator: { label: "Educador", description: "Enseña con nosotros" },
        teen: { label: "Adolescente", description: "Aprende y crea" },
        investor: { label: "Inversor", description: "Únete a nuestro viaje" },
        donor: { label: "Donante", description: "Apoya la educación artística" },
        "just-curious": { label: "Solo Curioso", description: "Aprende más" },
      },
      // Contact Page
      contact: {
        title: "Ponte en contacto",
        name: "Nombre",
        email: "Email",
        message: "Mensaje",
        submit: "Enviar mensaje",
        submitting: "Enviando...",
        success: "¡Mensaje enviado con éxito!",
        error: "Error al enviar el mensaje. Por favor, inténtalo de nuevo.",
      },
      // Beta Page
      beta: {
        title: "Únete a la Beta",
        subtitle: "Sé uno de los primeros en experimentar The Frame Game",
        apply: "Aplicar ahora",
      },
      // Common
      common: {
        loading: "Cargando...",
        error: "Ocurrió un error",
        adminLink: "Admin",
        footerText: "© 2026 The Frame Game. Todos los derechos reservados.",
        contactLink: "Contáctanos",
        learnMore: "Aprende más",
      },
      // Sections
      sections: {
        studioDemoTitle: "Frame Game Studio",
        studioDemoDescription: "Edita como un profesional con nuestro editor de línea de tiempo intuitivo",
        dashboardDemoTitle: "Panel de estudiantes y profesores",
        dashboardDemoDescription: "Rastrea el progreso y gestiona las tareas",
        cameraOverlayTitle: "Sistema de superposición de cámara",
        cameraOverlayDescription: "Guías de encuadre profesionales para filmación móvil",
        generalInfoTitle: "Acerca de The Frame Game",
        generalInfoDescription: "Aprende más sobre nuestra misión y visión",
        betaInfoTitle: "Programa Beta",
        betaInfoDescription: "Únete a nuestro programa de prueba temprana",
        investorInfoTitle: "Oportunidad de inversión",
        investorInfoDescription: "Asóciate con nosotros para revolucionar la educación artística",
        parentEducatorInfoTitle: "Para padres y educadores",
        parentEducatorInfoDescription: "Empodera a la próxima generación de creadores",
      },
      // Admin
      admin: {
        login: "Inicio de sesión Admin",
        password: "Contraseña",
        loginButton: "Iniciar sesión",
        dashboard: "Panel de Admin",
        logout: "Cerrar sesión",
        subscribers: "Suscriptores",
        contacts: "Envíos de contacto",
        emailTemplates: "Plantillas de email",
        timelines: "Líneas de tiempo",
        accessControl: "Control de acceso",
        contentManager: "Gestor de contenido",
        landingPage: "Página de inicio",
        settings: "Configuración",
        betaApplicants: "Solicitantes beta",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

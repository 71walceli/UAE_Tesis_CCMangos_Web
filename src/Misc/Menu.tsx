const publicUrl = process.env.PUBLIC_URL || ""

export const AppMenu = [
    {
      title: "Producción",
      icon: "bi-signpost-2",
      children: [
        {
          icon: "bi-cloud",
          title: "Datos edafoclimáticos",
          link: `${publicUrl}/weather/sync`,
          description: "Datos de temperatura, humedad, lluvia, viento, entre otros.",
        },
        {
          icon: "bi-lightning-charge",
          title: "Cosechas",
          link: `${publicUrl}/crop/production`,
          description: "Gestión de producción de mango por lotes.",
        },
        {
          icon: "bi-tree",
          title: "Control de árboles",
          link: `${publicUrl}/crop/readings`,
          description: "Gestión de controles de árboles de mango de muestra.",
        },
      ]
    },
    {
      title: "Estadísticas",
      icon: "bi-graph-up-arrow",
      children: [
        {
          icon: "bi-bar-chart-fill",
          title: "Estadísticas",
          link: `${publicUrl}/pred/analytics`,
          description: "Análisis de datos de producción y datos edafoclimáticos.",
        },
        {
          icon: "bi-graph-up",
          title: "Estimaciones",
          link: `${publicUrl}/pred/averange`,
          description: "Análisis de datos de producción y datos edafoclimáticos.",
        },
      ]
    },
    {
      title: "Configuración",
      icon: "bi-person-gear",
      children: [
        {
          icon: "bi-map-fill",
          title: "Áreas",
          link: `${publicUrl}/crop/areas`,
          description: "Gestión de áreas de cultivo.",
        },
        {
          icon: "bi-map-fill",
          title: "Lotes",
          link: `${publicUrl}/crop/lots`,
          description: "Gestión de lotes de cultivo.",
        },
        {
          icon: "bi-tree-fill",
          title: "Árboles de Mango",
          link: `${publicUrl}/crop/trees`,
          description: "Gestión de árboles de mango de muestra.",
        },
        {
          icon: "bi-people-fill",
          title: "Usuarios",
          link: `${publicUrl}/auth/users`,
          description: "Gestión de usuarios del sistema y sus roles.",
        },
        {
          icon: "bi-virus",
          title: "Enfermedad",
          link: `${publicUrl}/crop/affection`,
          description: "Gestión de enfermedades de los árboles de mango.",
        },
        {
          icon: "bi-tree",
          title: "Variedad",
          link: `${publicUrl}/crop/variety`,
          description: "Gestión de variedades de mango.",
        },
      ],
    }
  ];
  
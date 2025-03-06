Directory structure:
└── thejoeyweber-control-panel/
    ├── .cursorrules
    ├── _docs/
    │   ├── directory.md
    │   ├── next-plan.md
    │   ├── projectstructure.md
    │   ├── rebuild-plan.md
    │   ├── techstack.md
    │   └── prompts/
    │       ├── build-prompt.md
    │       ├── documentation-prompt.md
    │       ├── execution-prompt.md
    │       └── tech-recommendations-prompt.md
    ├── app/
    │   ├── README.md
    │   ├── astro.config.mjs
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tailwind.config.js
    │   ├── tsconfig.json
    │   ├── .dir
    │   ├── .gitignore
    │   ├── public/
    │   ├── src/
    │   │   ├── assets/
    │   │   ├── components/
    │   │   │   ├── Modal.astro
    │   │   │   ├── Toast.astro
    │   │   │   ├── Welcome.astro
    │   │   │   ├── activity/
    │   │   │   │   ├── ActivityFilters.astro
    │   │   │   │   ├── ActivityForm.astro
    │   │   │   │   ├── ActivityList.astro
    │   │   │   │   ├── ActivityPagination.astro
    │   │   │   │   └── ActivityStats.astro
    │   │   │   ├── ai/
    │   │   │   │   └── AIToolForm.astro
    │   │   │   ├── books/
    │   │   │   │   └── BookForm.astro
    │   │   │   ├── projects/
    │   │   │   │   ├── ProjectCard.astro
    │   │   │   │   ├── ProjectFilters.astro
    │   │   │   │   ├── ProjectForm.astro
    │   │   │   │   ├── ProjectStats.astro
    │   │   │   │   ├── ProjectsAttention.astro
    │   │   │   │   ├── RecentActivity.astro
    │   │   │   │   └── TechStack.astro
    │   │   │   ├── resources/
    │   │   │   │   └── ResourceForm.astro
    │   │   │   ├── revenue/
    │   │   │   │   └── RevenueForm.astro
    │   │   │   └── writing/
    │   │   │       └── WritingForm.astro
    │   │   ├── data/
    │   │   │   ├── activities.json
    │   │   │   ├── activities.ts
    │   │   │   ├── ai-tools.json
    │   │   │   ├── ai-tools.ts
    │   │   │   ├── books.json
    │   │   │   ├── books.ts
    │   │   │   ├── projects.ts
    │   │   │   ├── resources.json
    │   │   │   ├── resources.ts
    │   │   │   ├── revenue.json
    │   │   │   ├── revenue.ts
    │   │   │   ├── writing-pieces.json
    │   │   │   ├── writing.json
    │   │   │   └── writing.ts
    │   │   ├── layouts/
    │   │   │   ├── BaseLayout.astro
    │   │   │   └── Layout.astro
    │   │   ├── pages/
    │   │   │   ├── activity.astro
    │   │   │   ├── ai-library.astro
    │   │   │   ├── books.astro
    │   │   │   ├── index.astro
    │   │   │   ├── login.astro
    │   │   │   ├── projects.astro
    │   │   │   ├── resources.astro
    │   │   │   ├── revenue.astro
    │   │   │   ├── writing.astro
    │   │   │   ├── api/
    │   │   │   │   ├── activities/
    │   │   │   │   │   ├── [id].ts
    │   │   │   │   │   └── index.ts
    │   │   │   │   ├── activity/
    │   │   │   │   │   ├── [id].ts
    │   │   │   │   │   └── index.ts
    │   │   │   │   ├── ai-tools/
    │   │   │   │   │   ├── [id].ts
    │   │   │   │   │   └── index.ts
    │   │   │   │   ├── books/
    │   │   │   │   │   ├── [id].ts
    │   │   │   │   │   └── index.ts
    │   │   │   │   ├── projects/
    │   │   │   │   │   ├── [id].ts
    │   │   │   │   │   └── index.ts
    │   │   │   │   ├── resources/
    │   │   │   │   │   ├── [id].ts
    │   │   │   │   │   └── index.ts
    │   │   │   │   ├── revenue/
    │   │   │   │   │   ├── [id].ts
    │   │   │   │   │   └── index.ts
    │   │   │   │   └── writing/
    │   │   │   │       ├── [id].ts
    │   │   │   │       └── index.ts
    │   │   │   └── project/
    │   │   │       └── [id].astro
    │   │   ├── styles/
    │   │   │   └── global.css
    │   │   ├── types/
    │   │   │   ├── AITool.ts
    │   │   │   ├── Activity.ts
    │   │   │   ├── Resource.ts
    │   │   │   └── index.ts
    │   │   └── utils/
    │   │       ├── auth.ts
    │   │       ├── data.ts
    │   │       ├── filters.ts
    │   │       └── form.ts
    │   └── .vscode/
    │       ├── extensions.json
    │       └── launch.json
    └── prototype/
        ├── README.md
        ├── build.js
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.js
        ├── tailwind.config.js
        ├── update-pages.js
        ├── .gitignore
        ├── css/
        │   ├── styles.css
        │   └── tailwind.css
        ├── dist/
        │   ├── index.html
        │   ├── activity-dashboard/
        │   │   └── index.html
        │   ├── ai-library/
        │   │   └── index.html
        │   ├── books/
        │   │   └── index.html
        │   ├── css/
        │   │   ├── styles.css
        │   │   └── tailwind.css
        │   ├── img/
        │   ├── js/
        │   │   ├── build-pages.js
        │   │   └── main.js
        │   ├── pages/
        │   │   ├── activity-dashboard.html
        │   │   ├── ai-library.html
        │   │   ├── books.html
        │   │   ├── project-detail.html
        │   │   ├── projects.html
        │   │   ├── resources.html
        │   │   ├── revenue.html
        │   │   └── writing.html
        │   ├── project-detail/
        │   │   └── index.html
        │   ├── projects/
        │   │   └── index.html
        │   ├── resources/
        │   │   └── index.html
        │   ├── revenue/
        │   │   └── index.html
        │   └── writing/
        │       └── index.html
        ├── img/
        ├── js/
        │   ├── build-pages.js
        │   └── main.js
        ├── migration-scripts/
        │   └── create-page.js
        ├── pages/
        │   ├── activity-dashboard.html
        │   ├── ai-library.html
        │   ├── books.html
        │   ├── index.html
        │   ├── project-detail.html
        │   ├── projects.html
        │   ├── resources.html
        │   ├── revenue.html
        │   └── writing.html
        └── templates/
            └── base.html

# EasyDocs

EasyDocs is a student resource sharing platform where users upload and browse academic materials such as notes, summaries, exams,... 
all tagged by school, year, major, semester, subject and in the future also with type as in (exam, correction, cheat sheet, ...).

> Status: Early-stage MVP (Iteration 3), in active development. Built as a full-stack learning project with Supabase.

> Features: 

-  Email/password authentication (sign up, log in, log out)
-  Browse resources filtered by school → year → semester → major → subject
-  Upload PDF resources with metadata (title, description, subject)
-  Resource detail page with in-browser preview and download
-  Star ratings (1–5) and comments on resources
-  Edit and delete your own resources and comments
-  Profile page with stats (uploads, downloads, comments, average rating)

> Tech Stack:

    Layer -> Technology 
    Frontend -> HTML5, CSS3 (vanilla, modular), JavaScript (ES Modules) 
    Backend -> [Supabase](https://supabase.com) handles -> Postgres, Auth, Storage 
    Data access -> Row Level Security (RLS) policies + SQL triggers/RPCs 
    Hosting -> Static site (Netlify (canceled) / Cloudflare Pages (current version)) 
    No frontend framework or build step — plain ES modules imported directly in the browser.

> Project Structure

easydocs/
├── index.html          # Home / browse page
├── login.html
├── signup.html
├── upload.html
├── edit.html
├── resource.html        # Resource detail page
├── profile.html
│
├── css/                  # One file per component/page, imported via main.css
│   ├── main.css          # Import order: base → layout → components → pages
│   ├── variables.css / reset.css / typography.css / base.css
│   ├── navbar.css / footer.css / sidebar.css / grid.css
│   ├── buttons.css / cards.css / forms.css / modals.css / toast.css / ...
│   └── home.css / login.css / signup.css / upload.css / edit.css / ...
│
├── js/
│   ├── config/
│   │   └── supabase.js   # Supabase client initialization
│   ├── auth/
│   │   ├── auth.js       # login / signup / logout
│   │   ├── session.js    # getCurrentUser / requireLogin
│   │   └── navbar.js     # nav link visibility based on auth state
│   ├── api/               # Supabase queries, grouped by domain
│   │   ├── academic.js    # schools / years / semesters / majors / subjects
│   │   ├── resources.js   # CRUD, filtering, upload, rating
│   │   ├── comment.js
│   │   └── users.js
│   ├── pages/              # One entry file per HTML page
│   │   └── home.js / login.js / signup.js / upload.js / edit.js / resource.js / profile.js
│   └── ui/                 # Reusable UI helpers
│       ├── toast.js / uploads.js / document.js
│
└── assets/                # Logo, icons, illustrations

The reason for this structure is that when I first deployed I had html/, css/, js/ and assets/ but that failed and did not compile correctly because,
I later found out that CloudFlare pages expects and index.html to be present at the root level so Imigrated all the html there in order not to have to change all the paths

> Known Limitations

This is an early build — a few things are not there yet but will be added in upcoming versions:

- No pagination, resource lists load all matching results at once
- No text search, browsing relies on the school/year/major/semester/subject filters
- No moderation dashboard, the flag table exists but isn't wired up in the UI yet
- No automated tests

> Roadmap

- [ ] Search across resource titles/descriptions or tags 
- [ ] Pagination for resource lists
- [ ] Moderation/admin dashboard
- [ ] Notifications

> Minor upcoming fixes

- [ ] Entire document card should be clickable
- [ ] A profile card in the homepage
- [ ] Ensure file type
- [ ] Fixing a minor filter logic problem

> License

Personal academic project — no license specified yet.
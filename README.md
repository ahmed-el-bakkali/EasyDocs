# EasyDocs

EasyDocs is a full-stack web application that enables university students to discover, upload, rate, and discuss academic resources organized by school, academic year, semester, major, and subject. Built with vanilla JavaScript and Supabase, the project focuses on scalable database design, secure authentication, Row-Level Security, and a responsive user experience.
> Live DEMO : https://easydocs.ahmede7891325.workers.dev/

<img width="1917" height="927" alt="image" src="https://github.com/user-attachments/assets/fe27ceca-7f77-41d3-9ae2-564c43eb3264" />
> Home page preview
<img width="1507" height="692" alt="image" src="https://github.com/user-attachments/assets/e051ae7f-fcf1-474e-a413-3f8046aa802b" />
> Search result display
<img width="1917" height="922" alt="image" src="https://github.com/user-attachments/assets/9a070625-ba83-4d56-863b-a6a1e0122483" />
> Profile page after login/signup
<img width="1917" height="927" alt="image" src="https://github.com/user-attachments/assets/d09399df-602f-43ee-9b64-b5bd7984bc80" />
<img width="1582" height="786" alt="image" src="https://github.com/user-attachments/assets/3f19369a-4331-44f6-a9ee-58e9ddb22a82" />
<img width="1245" height="782" alt="image" src="https://github.com/user-attachments/assets/20277eb1-1f40-4993-974c-218312a9c3c8" />
> View resource page
<img width="1712" height="842" alt="image" src="https://github.com/user-attachments/assets/79593c5d-fc8f-46b5-bd8c-556f14e5919e" />
<img width="1707" height="597" alt="image" src="https://github.com/user-attachments/assets/a207a7c5-2add-4658-b407-eddeab4a013e" />
> Upload page

> Status: Early-stage MVP (Iteration 3), in active development. Built as a full-stack learning project with Supabase.

> Features: 

-  Email/password authentication (sign up, log in, log out)
-  Browse resources filtered by school → year → semester → major → subject
-  Upload PDF resources with metadata (title, description, school -> year -> ... -> subject)
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

<img width="628" height="682" alt="image" src="https://github.com/user-attachments/assets/12560bea-460f-4118-8569-7090ea6c0568" />

The reason for this structure is that when I first deployed I had html/, css/, js/ and assets/ but that failed and did not compile correctly because,
I later found out that CloudFlare pages expects and index.html to be present at the root level so Imigrated all the html there in order not to have to change all the paths

> Data base design
- The core features I had in mind when I first started ths project were :
  1. users upload a resource caracterized by school, year, semester, major, subject
  2. users can browse and interract with content by rating, commenting and flagging in some cases (duplicated material, wrong tags as in year or subject...)
- And that is why the initial database on paper looked like this :
  <img width="1600" height="1172" alt="WhatsApp Image 2026-07-09 at 09 17 46" src="https://github.com/user-attachments/assets/9694fdd5-2404-4f29-9b41-4e7c16122ea2" />
- After building it on supabase and adding those features it ended up looking like this :
  <img width="1011" height="783" alt="image" src="https://github.com/user-attachments/assets/cf2bb973-c6ae-4e79-84b4-6fcddefcb081" />

> Known Limitations

This is an early build a few things are not there yet but will be added in upcoming versions:

- No pagination, resource lists load all matching results at once
- No text search, browsing relies on the school/year/major/semester/subject filters
- No moderation dashboard, the flag table exists but isn't wired up in the UI yet

> Roadmap

- [ ] Search across resource titles/descriptions or tags 
- [ ] Pagination for resource lists
- [ ] Moderation/admin dashboard
- [ ] Notifications
- [ ] Adding a page or section for saved content
- [ ] Checking email domain (I want to ensure that only students that are enrolled in a school and have a valid institutional email are able to post content under their school tag to ensure the integrity of the posted material)

> Minor upcoming fixes

- [ ] Entire document card should be clickable
- [ ] A profile card in the homepage
- [ ] Ensure file type is pdf or ppt
- [ ] Fixing a minor filter logic problem

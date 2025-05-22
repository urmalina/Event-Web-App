--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: PriceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PriceType" AS ENUM (
    'DAY',
    'HOUR'
);


ALTER TYPE public."PriceType" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'ORGANIZER',
    'PROVIDER'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

--
-- Name: Weekday; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Weekday" AS ENUM (
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'SUN'
);


ALTER TYPE public."Weekday" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AvailabilitySchedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AvailabilitySchedule" (
    id text NOT NULL,
    days public."Weekday"[],
    "startTime" text NOT NULL,
    "endTime" text NOT NULL
);


ALTER TABLE public."AvailabilitySchedule" OWNER TO postgres;

--
-- Name: Booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Booking" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "eventId" text NOT NULL,
    "serviceId" text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "durationMinutes" integer,
    "endTime" timestamp(3) without time zone NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Booking" OWNER TO postgres;

--
-- Name: DraftEvent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DraftEvent" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text,
    type text,
    date timestamp(3) without time zone,
    "guestsCount" integer,
    "venueId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."DraftEvent" OWNER TO postgres;

--
-- Name: DraftService; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DraftService" (
    id text NOT NULL,
    "draftId" text NOT NULL,
    "serviceId" text NOT NULL
);


ALTER TABLE public."DraftService" OWNER TO postgres;

--
-- Name: Event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Event" (
    id text NOT NULL,
    title text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    location text NOT NULL,
    budget integer NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "organizerId" text NOT NULL
);


ALTER TABLE public."Event" OWNER TO postgres;

--
-- Name: EventService; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EventService" (
    id text NOT NULL,
    "eventId" text NOT NULL,
    "serviceId" text NOT NULL
);


ALTER TABLE public."EventService" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'unread'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Service" (
    id text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    price integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "providerId" text NOT NULL,
    "availabilityId" text,
    capacity integer,
    city text NOT NULL,
    description text NOT NULL,
    experience integer,
    location text,
    photos text[],
    "priceType" public."PriceType" NOT NULL,
    "venueType" text,
    "workFormats" text[]
);


ALTER TABLE public."Service" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: AvailabilitySchedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AvailabilitySchedule" (id, days, "startTime", "endTime") FROM stdin;
\.


--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Booking" (id, "userId", "eventId", "serviceId", status, "createdAt", "durationMinutes", "endTime", "startTime") FROM stdin;
\.


--
-- Data for Name: DraftEvent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DraftEvent" (id, "userId", title, type, date, "guestsCount", "venueId", "createdAt") FROM stdin;
503e9478-d58f-4612-a474-12f4a58f8cd9	c8660471-efba-4aac-9127-25d72c2d2ae4	тест	wedding	2025-07-17 00:00:00	50	\N	2025-04-06 21:56:30.735
2ff0e29a-b8b5-45c4-bffe-0d818d1c48d3	c8660471-efba-4aac-9127-25d72c2d2ae4	выпускной из мисиса	Корпоратив	2025-06-30 00:00:00	102	a3c1f954-4e19-461f-afb8-d778f6d67983	2025-04-06 20:43:48.48
5b5486fb-d104-4aed-98e5-a69e2a24ab32	c8660471-efba-4aac-9127-25d72c2d2ae4	Черновик мероприятия	wedding	2025-04-24 00:00:00	55	79895c74-b944-4465-b1e5-d0f66e40eb6e	2025-04-06 20:37:32.648
\.


--
-- Data for Name: DraftService; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DraftService" (id, "draftId", "serviceId") FROM stdin;
2877d6cb-e6b5-4ec2-a27f-dc0bf16ba6fc	2ff0e29a-b8b5-45c4-bffe-0d818d1c48d3	73c1a43f-e458-407a-843c-de497121af62
c336e03a-9b89-4bdc-94cb-04ddff9ab74a	2ff0e29a-b8b5-45c4-bffe-0d818d1c48d3	1f378d80-b052-433b-9135-5f73010b033c
c1594901-ee9b-4509-9e76-b8762b80c40a	5b5486fb-d104-4aed-98e5-a69e2a24ab32	3cd2842a-3cb1-4dac-bf4c-dfc97779891f
623a1dfb-40b0-48ee-822d-f877ffa5a182	5b5486fb-d104-4aed-98e5-a69e2a24ab32	38411e08-17cd-410a-a26b-a4ee5ba15063
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Event" (id, title, date, location, budget, status, "createdAt", "organizerId") FROM stdin;
\.


--
-- Data for Name: EventService; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EventService" (id, "eventId", "serviceId") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "userId", message, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Service" (id, name, category, price, "createdAt", "providerId", "availabilityId", capacity, city, description, experience, location, photos, "priceType", "venueType", "workFormats") FROM stdin;
cbdd4e44-f34b-4fd8-ba53-f7426a8433dc	Банкетный зал 1	Аренда площадки	50000	2025-04-05 17:49:30.737	e93a5571-1966-430d-998e-db4e4e0a246c	\N	100	Москва	test	\N		{}	DAY	Банкетный зал	{}
97a8f64b-ae61-4061-8666-0fae90516016	Лофт пространство LOUNGE #457 VDNH	Аренда площадки	30000	2025-04-05 18:54:41.162	e93a5571-1966-430d-998e-db4e4e0a246c	\N	120	Москва	Темная площадка для вечеринки, проведения свадьбы, презентаций, проведения банкета. Стильное помещение с панорамными окнами и выходом на крышу на территории парка ВДНХ для проведения неформальных мероприятий и бизнес мероприятий с отдельным входом. 	\N	ВДНХ	{}	HOUR	Банкетный зал	{}
a3c1f954-4e19-461f-afb8-d778f6d67983	Лес Event House 	Аренда площадки	150000	2025-04-05 19:15:37.031	e93a5571-1966-430d-998e-db4e4e0a246c	\N	200	Москва	Уникальное загородное пространство площадью более 2 гектаров с эстетикой лиственного леса и прудом. Круглогодичное пространство для проведения корпоративных мероприятий и тимбилдингов, дней рождений и частных праздников 🌿	\N	Отрадное, Московская обл., 143442	{/uploads/bdeeeed0-ca04-4853-a80f-77bd4f73b2f3-1732549773-5579.jpeg,/uploads/b2f19572-3a15-48d7-b15d-d851eab6d6cb-les_event14.jpg}	DAY	Банкетный зал	{}
0ab32e5a-a3d1-4256-8f67-dc601c20dcdf	Фотограф на конференцию	Фотограф	8000	2025-04-06 14:22:26.84	4821f813-ab3c-415a-82e3-3ef9400501c4	\N	\N	Москва	Организация профессиональной съемки конференций, съемки бизнес событий, видео и фотосъемки выставок, презентаций в Москве и за ее пределами. Профессиональная обработка фото и видео. Сдача материала точно в срок или раньше. Полная юридическая гарантия. Возможен срочный выезд видеооператора и фотографа на конференцию. Успейте забронировать дату проведения мероприятия, чтобы мы не планировали в этот день других съемок.	6		{/uploads/6c1c2b50-8378-4298-8766-be42caea93ce-129.jpg,/uploads/a1f3c1fc-70eb-424d-84c3-0d112acd2d5c-fotograf-na-meropriyatie-3.jpeg}	HOUR	\N	{"по часу","весь день"}
1f378d80-b052-433b-9135-5f73010b033c	Видеограф	Фотограф	2500	2025-04-06 18:19:03.831	e93a5571-1966-430d-998e-db4e4e0a246c	\N	\N	Москва	Профессионально работаю с видео и звуком. Сегодня снимаю для компаний, гос. структур и частных клиентов.	4		{/uploads/b5342bc9-38bf-47e8-95a9-6d2f23e2d19a-DSC08726-min.jpg}	HOUR	\N	{"по часу"}
73c1a43f-e458-407a-843c-de497121af62	Грузинская кухня на мероприятие	Кейтеринг	100000	2025-04-06 18:26:54.082	540a37c6-e75d-4aaf-8989-6ba806cfff68	\N	\N	Москва	Погрузитесь во вкусы Грузии с нашим кейтерингом: хинкали, хачапури и ароматные шашлыки на ваш праздник! Обслуживание мероприятий любого формата с душой и по-домашнему вкусно.	\N		{/uploads/7b087aa8-1696-4443-ac1e-815225a6fd91-1-2.jpg,/uploads/0efbafc3-0728-4195-ae4c-8aacc6fe66db-Национальные-грузинские-блюда-top-10-optimized.webp}	DAY	\N	{}
aedc220e-6308-4df9-9326-53fe493fde23	Фуршет на выезд	Кейтеринг	70000	2025-04-06 18:30:38.726	540a37c6-e75d-4aaf-8989-6ba806cfff68	\N	\N	Москва	Элегантный фуршет в европейском стиле для вашего события — канапе, тарталетки, изысканные сыры и десерты. Организуем обслуживание на высшем уровне с учётом всех пожеланий.	\N		{/uploads/9b42e149-755b-47b0-9537-ed7319bbc3c7-508a72f2-0ef2-44f5-961b-10cb770785f3.png}	DAY	\N	{}
758d67b4-0b1c-4a6d-9c95-2b0d88536f5b	Современный конференц-зал	Аренда площадки	100000	2025-04-07 20:25:30.477	c8660471-efba-4aac-9127-25d72c2d2ae4	\N	300	Москва	Функциональное пространство для деловых мероприятий: семинаров, тренингов, мастер-классов и встреч. Оснащено проектором, экраном, Wi-Fi, звуком и климат-контролем. Современный интерьер, комфортная мебель и панорамные окна создают деловую, но неформальную атмосферу.	\N		{/uploads/d19cedeb-1cb6-4096-ae7b-10de494f15ac-129.jpg,/uploads/1f261f64-8c28-4269-a2a6-f2a72b942a50-yandexart-fbvtmfrfhohplr58flqi.jpeg}	DAY	Банкетный зал	{}
5f490f80-37f5-44f8-b94a-55fb05b51ac9	Площадка для проведения мероприятий на природе	Аренда площадки	200000	2025-04-07 20:30:42.638	e93a5571-1966-430d-998e-db4e4e0a246c	\N	300	Москва	Живописная площадка на свежем воздухе, окружённая зеленью и цветами, идеально подойдёт для выездной церемонии. Пространство оборудовано аркой, украшенной живыми цветами, стульями с бантиками, декоративным освещением и зоной для фотосессий. Идеальный выбор для романтичного торжества в тёплое время года.	\N	пос. Апрелевка	{/uploads/5d4f885a-f7f6-406d-9d77-687d2f252689-yandexart-fbvetddfkrcglqauckvn.jpeg,/uploads/7680dd5d-aa97-439d-a10e-a30894d5c1a5-yandexart-fbv0thosjfqhtvr6ru2c.jpeg,/uploads/ad339faa-a005-4b7e-9006-4ac0b79dc507-yandexart-fbv6f1qbif8mmhnrbs2t.jpeg}	DAY	Банкетный зал	{}
5c5c391b-7e4d-440f-9d30-bedaaba36e70	 Художественная студия	Аренда площадки	6000	2025-04-07 20:35:56.654	540a37c6-e75d-4aaf-8989-6ba806cfff68	\N	15	Москва	Светлая творческая площадка с мольбертами, большими окнами и деревянной мебелью. Отлично подходит для живописи, арт-терапии, мастер-классов для детей и взрослых. В помещении уютная атмосфера, которая вдохновляет на творчество.	\N	ВДНХ	{/uploads/ac20f870-6d89-4b86-b048-a5b27aa29779-yandexart-fbvjbeh8lsj65d1cli2g.jpeg}	HOUR	Арт пространство	{}
79895c74-b944-4465-b1e5-d0f66e40eb6e	Креативное пространство	Аренда площадки	30000	2025-04-07 20:38:41.392	540a37c6-e75d-4aaf-8989-6ba806cfff68	\N	50	Москва	Универсальная площадка в стиле лофт для образовательных и нетворкинг-мероприятий. Высокие потолки, индустриальный дизайн, мягкие зоны для общения, сцена с подсветкой и проекционным экраном. Отличный выбор для стартап-питчей, творческих встреч и презентаций.	\N	м. Октябрьская	{/uploads/84f14bb1-3c59-4dcf-ba61-4508ade9f971-yandexart-fbvd6bsvb1rd00jjdoan.jpeg,/uploads/b4a022ed-e148-40d1-b2d8-1134821ed9b8-yandexart-fbv06ags8oq7d2s8lk7d.jpeg}	DAY	Лофт	{}
b56f57c4-4844-4684-94d4-7868974d1e12	Профессиональный DJ	Музыка	30000	2025-04-07 20:43:11.108	a5b07fbc-62dd-4480-b59d-f0897c1f63f0	\N	\N	Москва	Профессиональный DJ с опытом более 5 лет в индустрии мероприятий. Играет популярные треки, умеет адаптироваться под настроение гостей. В наличии своя звуковая и световая аппаратура, в том числе лазеры, динамическая подсветка, дым-машина. Подходит для свадеб, корпоративов, выпускных, частных вечеринок. Индивидуальный подбор плейлиста и работа по таймингу мероприятия.	\N		{/uploads/285613a7-5f81-44cb-91be-012a5efd3f87-yandexart-fbvp1e54q8qq275d5hpb.jpeg}	DAY	\N	{}
38411e08-17cd-410a-a26b-a4ee5ba15063	Фотограф на ваше мероприятие	Фотограф	15000	2025-04-07 20:48:56.594	4821f813-ab3c-415a-82e3-3ef9400501c4	\N	\N	Москва	Опытный фотограф для мероприятий любого формата — свадьбы, корпоративы, дни рождения, выпускные. Работа в жанре репортажа и постановочной съёмки. Профессиональное оборудование (Canon R6, Sigma Art), творческий подход к кадру, внимательность к деталям. Возможна организация фотозоны. Готовые фото — через 3-5 дней, цветокоррекция включена в стоимость.	7		{/uploads/c7c3a00f-c868-45a5-8271-9f1e48e8ddd9-skolko-stoit-fotosessiya-rastsenki-fotografov-4.jpg}	DAY	\N	{"по часу","пакет услуг","весь день"}
08d068d6-2372-4755-b0fa-63fbd7bd7963	Ведущий на мероприятие	Ведущий	10000	2025-04-07 20:55:11.626	4821f813-ab3c-415a-82e3-3ef9400501c4	\N	\N	Москва	Профессиональный ведущий для мероприятий любого масштаба. Авторские сценарии, интерактивы, конкурсы без банальностей. Имеется опыт ведения свадеб, корпоративов, выпускных, юбилеев. Стрессоустойчивость, чувство юмора и грамотная речь. Возможна работа в паре с диджеем и создание индивидуального сценария под мероприятие.	\N		{/uploads/8d75c413-2a20-4cff-a178-cf90886fda3b-view-black-white-person-attending-theatre.jpg}	HOUR	\N	{}
3cd2842a-3cb1-4dac-bf4c-dfc97779891f	Кейтеринг премиум	Кейтеринг	15000	2025-04-07 20:58:17.222	4821f813-ab3c-415a-82e3-3ef9400501c4	\N	\N	Москва	Выездной кейтеринг премиум-класса: от небольших фуршетов до банкетов на 200+ гостей. В ассортименте — европейская, азиатская, вегетарианская кухня, десерты и напитки. Возможна аренда посуды, столов, текстиля, персонал – официанты, повара. Индивидуальное меню под формат и бюджет мероприятия. Доставка, обслуживание и уборка включены.	\N		{/uploads/f1d4a6f9-736e-420d-95fd-db0d2110aa72-beautiful-sweets-with-strawberries-wedding-celebration.jpg,/uploads/3257ef45-8d93-46bb-b992-daa17a289edc-cup-dessert-with-whipped-cream-strawberries-cherries-orange.jpg}	HOUR	\N	{}
6b5fa1a7-4a6d-4f30-8a96-1ce2865b1fc5	Декор площадки	Декор	40000	2025-04-07 21:01:26.498	4821f813-ab3c-415a-82e3-3ef9400501c4	\N	\N	Москва	Профессиональное оформление мероприятий под ключ — от свадеб и дней рождений до конференций и фотозон. Мы создаём атмосферу и визуальный стиль, который запомнится вашим гостям: живые и искусственные цветочные композиции, арки, фотозоны, текстиль, скатерти, подсветка, свечи и тематический реквизит.\n\nРаботаем в любом стиле: классика, бохо, рустик, минимализм, glam, forest и другие. Предоставим 3D-эскиз будущего оформления, подберём цветовую гамму, всё установим и демонтируем самостоятельно. Индивидуальный подход к каждому мероприятию.	\N		{/uploads/635de503-bfae-4f53-89eb-c90fd8817d5b-beautiful-photo-flowers-delicate-shades_8353-10609.jpg,/uploads/4193d2d6-da67-4006-80d9-39fe09a141cf-beautiful-wedding-table-arrangement-outside_23-2149617115.jpg,/uploads/d0319843-4687-4768-ad7d-b34158f448c6-банкетный_зал.jpg}	DAY	\N	{}
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, "createdAt", role) FROM stdin;
e93a5571-1966-430d-998e-db4e4e0a246c	Иван Арендодателевич	ivan@mail.ru	$2b$10$q4Ha7Hvxe/JuWbxY0DRXSuqj0y35eb02Ne3d1n8kvCTu1baKh5UV6	2025-04-05 17:47:55.572	PROVIDER
c8660471-efba-4aac-9127-25d72c2d2ae4	Алина	alino4ka.u@mail.ru	$2b$10$IhciQaBEG8KsqShhdcE6Jub/Fx6G6OjabjQa71UPmNksHAetanXWO	2025-04-05 19:39:57.422	ORGANIZER
4821f813-ab3c-415a-82e3-3ef9400501c4	Михаил Фотографович	misha@mail.ru	$2b$10$F1RAo8/QpIM5CMMM8Ku91e4YHdYfZx9gUgWGPU4f9njsapY1BNxG.	2025-04-06 14:13:48.986	PROVIDER
540a37c6-e75d-4aaf-8989-6ba806cfff68	Александр	sasha@mail.ru	$2b$10$bgx2n3UkJeMcMwSuU4kElu2NgSV/npVuWOBbYrsycNQwJlut5zCCm	2025-04-06 18:20:44.909	PROVIDER
a5b07fbc-62dd-4480-b59d-f0897c1f63f0	Антон	dj@mail.ru	$2b$10$OgrsSTMR4cN7c2YZ6A675uWLOxdCA80hwUZ03D96Pm/S5j.dK5pSC	2025-04-07 20:41:22.901	PROVIDER
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
aa9ca222-19f9-477b-95c8-7960244c0854	8f96fbb0744509f016d6f3a11e0b76cf202d3356353392e15dbe2560f7f9f34a	2025-04-05 20:38:31.149864+03	20250309150859_fix_event_service_relation	\N	\N	2025-04-05 20:38:31.08227+03	1
c2bd839e-115e-4034-a7ac-d93d0567adb2	b0b1fa79f03e6fa03c956d391b8b45de612b197fe85aa1c8226ec5d462984e12	2025-04-05 20:38:31.164456+03	20250309203803_add_roles_and_services	\N	\N	2025-04-05 20:38:31.150661+03	1
83062ead-2ecb-4ada-9350-b773d9e5b2e3	6225fc608835480fb2001393a108993e414a212a0e48ffa61d6570f2b9bc34d8	2025-04-05 20:38:31.179389+03	20250323204052_add_availability_schedule	\N	\N	2025-04-05 20:38:31.165332+03	1
\.


--
-- Name: AvailabilitySchedule AvailabilitySchedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AvailabilitySchedule"
    ADD CONSTRAINT "AvailabilitySchedule_pkey" PRIMARY KEY (id);


--
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- Name: DraftEvent DraftEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DraftEvent"
    ADD CONSTRAINT "DraftEvent_pkey" PRIMARY KEY (id);


--
-- Name: DraftService DraftService_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DraftService"
    ADD CONSTRAINT "DraftService_pkey" PRIMARY KEY (id);


--
-- Name: EventService EventService_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EventService"
    ADD CONSTRAINT "EventService_pkey" PRIMARY KEY (id);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Booking Booking_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Booking Booking_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Booking Booking_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DraftEvent DraftEvent_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DraftEvent"
    ADD CONSTRAINT "DraftEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DraftEvent DraftEvent_venueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DraftEvent"
    ADD CONSTRAINT "DraftEvent_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DraftService DraftService_draftId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DraftService"
    ADD CONSTRAINT "DraftService_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES public."DraftEvent"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DraftService DraftService_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DraftService"
    ADD CONSTRAINT "DraftService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EventService EventService_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EventService"
    ADD CONSTRAINT "EventService_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EventService EventService_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EventService"
    ADD CONSTRAINT "EventService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Event Event_organizerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Service Service_availabilityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES public."AvailabilitySchedule"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Service Service_providerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--


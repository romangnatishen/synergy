--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1 (Debian 13.1-1.pgdg100+1)
-- Dumped by pg_dump version 13.1 (Debian 13.1-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: events; Type: TABLE; Schema: public; Owner: jamshoot
--

CREATE TABLE public.events (
    id integer NOT NULL,
    tittle character varying(255) NOT NULL,
    project_id integer,
    description character varying(255),
    start_date timestamp with time zone NOT NULL,
    start_hours character varying(255) NOT NULL,
    start_minutes character varying(255),
    end_date timestamp with time zone NOT NULL,
    end_hours character varying(255) NOT NULL,
    end_minutes character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.events OWNER TO jamshoot;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: jamshoot
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO jamshoot;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jamshoot
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: kanban_comments; Type: TABLE; Schema: public; Owner: jamshoot
--

CREATE TABLE public.kanban_comments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    user_name character varying(255) NOT NULL,
    issue_id integer NOT NULL,
    description character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.kanban_comments OWNER TO jamshoot;

--
-- Name: kanban_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: jamshoot
--

CREATE SEQUENCE public.kanban_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kanban_comments_id_seq OWNER TO jamshoot;

--
-- Name: kanban_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jamshoot
--

ALTER SEQUENCE public.kanban_comments_id_seq OWNED BY public.kanban_comments.id;


--
-- Name: kanban_issues; Type: TABLE; Schema: public; Owner: jamshoot
--

CREATE TABLE public.kanban_issues (
    id integer NOT NULL,
    project_id integer,
    project_name character varying(255),
    kanban_status_id integer,
    executor_id integer,
    executor_name character varying(255),
    issue_id integer,
    issue_name character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    important_issue integer,
    executed_issue integer,
    auditor_id integer,
    auditor_name character varying
);


ALTER TABLE public.kanban_issues OWNER TO jamshoot;

--
-- Name: kanban_issues_id_seq; Type: SEQUENCE; Schema: public; Owner: jamshoot
--

CREATE SEQUENCE public.kanban_issues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kanban_issues_id_seq OWNER TO jamshoot;

--
-- Name: kanban_issues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jamshoot
--

ALTER SEQUENCE public.kanban_issues_id_seq OWNED BY public.kanban_issues.id;


--
-- Name: participants; Type: TABLE; Schema: public; Owner: jamshoot
--

CREATE TABLE public.participants (
    id integer NOT NULL,
    event_id integer NOT NULL,
    participant_id integer NOT NULL,
    event_owner integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.participants OWNER TO jamshoot;

--
-- Name: participants_id_seq; Type: SEQUENCE; Schema: public; Owner: jamshoot
--

CREATE SEQUENCE public.participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.participants_id_seq OWNER TO jamshoot;

--
-- Name: participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jamshoot
--

ALTER SEQUENCE public.participants_id_seq OWNED BY public.participants.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: jamshoot
--

CREATE TABLE public.users (
    id integer NOT NULL,
    role integer,
    user_status integer,
    name character varying(255),
    email character varying(255) NOT NULL,
    redmine_api_key character varying(255),
    password character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO jamshoot;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: jamshoot
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO jamshoot;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jamshoot
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: jamshoot
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: kanban_comments id; Type: DEFAULT; Schema: public; Owner: jamshoot
--

ALTER TABLE ONLY public.kanban_comments ALTER COLUMN id SET DEFAULT nextval('public.kanban_comments_id_seq'::regclass);


--
-- Name: kanban_issues id; Type: DEFAULT; Schema: public; Owner: jamshoot
--

ALTER TABLE ONLY public.kanban_issues ALTER COLUMN id SET DEFAULT nextval('public.kanban_issues_id_seq'::regclass);


--
-- Name: participants id; Type: DEFAULT; Schema: public; Owner: jamshoot
--

ALTER TABLE ONLY public.participants ALTER COLUMN id SET DEFAULT nextval('public.participants_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: jamshoot
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: jamshoot
--

COPY public.events (id, tittle, project_id, description, start_date, start_hours, start_minutes, end_date, end_hours, end_minutes, "createdAt", "updatedAt") FROM stdin;
1	lkj;lkj;lkj	113	;lkj;lkj;lkj;lkj	2021-06-08 00:00:00+00	13		2021-06-15 00:00:00+00	15		2021-06-08 05:07:15.888+00	2021-06-08 05:07:15.888+00
2	dfsdfsdf	0	dsdsfsdfsdf	2021-06-08 00:00:00+00	15		2021-06-15 00:00:00+00	17		2021-06-08 05:17:04.578+00	2021-06-08 05:17:04.578+00
3	afadsfadfs	51	adfadfadf	2021-06-30 00:00:00+00	09		2021-06-08 00:00:00+00	12		2021-06-08 05:41:43.679+00	2021-06-08 05:41:43.679+00
4	dsfdfsdf	51	adsfadf	2021-06-08 00:00:00+00	06		2021-06-08 00:00:00+00	11		2021-06-08 05:43:19.891+00	2021-06-08 05:43:19.891+00
5	adfadf	96	asdfadf	2021-06-08 00:00:00+00	05		2021-06-08 00:00:00+00	13		2021-06-08 05:45:50.507+00	2021-06-08 05:45:50.507+00
6	adfadfadfa	92	adfadsfadf	2021-06-08 00:00:00+00	05		2021-06-15 00:00:00+00	10		2021-06-08 05:47:36.633+00	2021-06-08 05:47:36.633+00
7	adsafad	96	asdfadfad	2021-06-08 00:00:00+00	07		2021-06-08 00:00:00+00	13		2021-06-08 05:49:16.181+00	2021-06-08 05:49:16.181+00
8	adfadfdf	45	adfadfadf	2021-06-08 00:00:00+00			2021-06-09 00:00:00+00	09		2021-06-08 05:50:29.115+00	2021-06-08 05:50:29.115+00
9	;lasdkfja;dlfkj	113	a;dlfjad;flkj	2021-06-08 00:00:00+00	07		2021-06-08 00:00:00+00	13		2021-06-08 05:55:18.393+00	2021-06-08 05:55:18.393+00
10	adfafdadf	45	adfadfadfadf	2021-06-08 00:00:00+00	06		2021-06-08 00:00:00+00	16		2021-06-08 06:08:16.211+00	2021-06-08 06:08:16.211+00
11	afafasfadfadf	82	adfadfadfadf	2021-06-06 00:00:00+00	10		2021-06-06 00:00:00+00	19	25	2021-06-08 06:10:52.084+00	2021-06-08 06:10:52.084+00
12	тестовая тема	51	тестовое описание	2021-06-07 00:00:00+00	04		2021-06-07 00:00:00+00	15	25	2021-06-08 06:12:21.03+00	2021-06-08 06:12:21.03+00
13	Testowe wydarzenie	45	Testowy opis	2021-06-15 00:00:00+00	09		2021-06-15 00:00:00+00	15		2021-06-08 06:18:09.771+00	2021-06-08 06:18:09.771+00
14	;adlfkajd;flakjf	96	adfafadsf	2021-06-07 00:00:00+00	04		2021-06-07 00:00:00+00	12	30	2021-06-08 06:21:16.685+00	2021-06-08 06:21:16.685+00
15	;adlfkajd;flakjf	96	adfafadsf	2021-06-09 00:00:00+00	04		2021-06-09 00:00:00+00	12	30	2021-06-08 06:29:55.802+00	2021-06-08 06:29:55.802+00
16	adf;alkdjfa;dflkkajdf	93	asdf;lakfdj;aldkfj	2021-06-15 00:00:00+00	15		2021-06-15 00:00:00+00	17		2021-06-08 18:28:42.2+00	2021-06-08 18:28:42.2+00
17	;lkadjf;alkdfj	45	adflakjdf;alkdfj	2021-06-15 00:00:00+00	12	10	2021-06-15 00:00:00+00	16	50	2021-06-08 18:31:03.817+00	2021-06-08 18:31:03.817+00
18	dddddddddddd	45	dddddddddddddd	2021-06-08 00:00:00+00	05	25	2021-06-08 00:00:00+00	12	55	2021-06-08 18:32:06.59+00	2021-06-08 18:32:06.59+00
19	22222222222222	93	333333333333333333	2021-06-29 00:00:00+00	14	15	2021-06-30 00:00:00+00	16	45	2021-06-08 18:40:13.996+00	2021-06-08 18:40:13.996+00
20	444444444444	45	5555555555	2021-06-15 00:00:00+00	10	10	2021-06-16 00:00:00+00	15	15	2021-06-08 18:42:26.291+00	2021-06-08 18:42:26.291+00
21	1111111111	92	333333333333	2021-06-07 00:00:00+00	01	05	2021-06-09 00:00:00+00	10	55	2021-06-08 18:46:01.175+00	2021-06-08 18:46:01.175+00
22	222222222	45	333333333333	2021-06-22 00:00:00+00	02	05	2021-06-23 00:00:00+00	14	35	2021-06-08 18:48:08.21+00	2021-06-08 18:50:06.942+00
23	2222222222	92	77777777777777777	2021-06-07 00:00:00+00	03	05	2021-06-09 00:00:00+00	07	25	2021-06-08 18:52:14.208+00	2021-06-08 18:52:14.208+00
24	1111111111	81	22222222222222	2021-06-08 00:00:00+00	08	15	2021-06-09 00:00:00+00	12	35	2021-06-08 18:53:44.306+00	2021-06-08 18:53:44.306+00
25	33333333333	91	444444444444444	2021-06-15 00:00:00+00	06	15	2021-06-15 00:00:00+00	12	45	2021-06-08 18:55:29.714+00	2021-06-08 18:55:29.714+00
26	222222222	6	333333333333333	2021-06-22 00:00:00+00	09	05	2021-06-23 00:00:00+00	10	10	2021-06-08 18:57:00.616+00	2021-06-08 18:57:00.616+00
27	22222222222	51	44444444444444444	2021-06-22 00:00:00+00	03	10	2021-06-23 00:00:00+00	07	35	2021-06-08 18:58:25.608+00	2021-06-08 18:59:17.975+00
28	222222222	91	444444444444444	2021-06-15 00:00:00+00	04	15	2021-06-16 00:00:00+00	13	35	2021-06-08 19:14:46.91+00	2021-06-08 19:14:46.91+00
29	111111111111	91	2222222222222222	2021-06-08 00:00:00+00	05	10	2021-06-09 00:00:00+00	05	50	2021-06-08 19:19:45.834+00	2021-06-08 19:19:45.834+00
30	2222222222	3	333333333333333333	2021-06-14 00:00:00+00	11		2021-06-15 00:00:00+00	13		2021-06-08 19:20:47.371+00	2021-06-08 19:20:47.371+00
31	normal tittle	113	1111111111111111111	2021-06-08 00:00:00+00	09	15	2021-06-08 00:00:00+00	13	50	2021-06-08 19:22:27.859+00	2021-06-08 19:25:19.281+00
\.


--
-- Data for Name: kanban_comments; Type: TABLE DATA; Schema: public; Owner: jamshoot
--

COPY public.kanban_comments (id, user_id, user_name, issue_id, description, "createdAt", "updatedAt") FROM stdin;
1	1	Roman Gnatyshen	14690	Testowy komentarz	2021-06-02 03:42:53.172+00	2021-06-02 03:42:53.172+00
2	1	Roman Gnatyshen	14690	Testowy komentarz 123	2021-06-02 03:46:21.947+00	2021-06-02 03:46:21.947+00
3	1	Roman Gnatyshen	14690	Poprawny komentarz	2021-06-02 03:50:01.182+00	2021-06-02 03:50:01.182+00
4	1	rg	14667	Komentuję zadanie	2021-06-02 03:51:06.858+00	2021-06-02 03:51:06.858+00
5	1	Roman Gnatyshen	14476	Dodaję komentarz do zadania	2021-06-02 07:00:32.999+00	2021-06-02 07:00:32.999+00
6	1	Roman Gnatyshen	14476	Dodaję komentarz do zadaniaKo	2021-06-02 07:01:32.699+00	2021-06-02 07:01:32.699+00
7	1	Roman Gnatyshen	14690	Komentarz testowy	2021-06-02 07:02:44.929+00	2021-06-02 07:02:44.929+00
8	1	Roman Gnatyshen	14690	Komentarz jeszcze jeden	2021-06-02 07:03:01.786+00	2021-06-02 07:03:01.786+00
9	1	Roman Gnatyshen	14690	szósty komentarz	2021-06-02 07:03:22.829+00	2021-06-02 07:03:22.829+00
10	1	Roman Gnatyshen	14690	Jeszcze jeden komentarz	2021-06-02 07:05:52.73+00	2021-06-02 07:05:52.73+00
11	1	Roman Gnatyshen	14667	Poprawiliśmy wszystko, zostaje jeden drobny niuans	2021-06-08 19:32:24.531+00	2021-06-08 19:32:24.531+00
12	1	Roman Gnatyshen	14667	Szystko ok, będziemy zamykać temat jutro	2021-06-08 19:32:51.198+00	2021-06-08 19:32:51.198+00
\.


--
-- Data for Name: kanban_issues; Type: TABLE DATA; Schema: public; Owner: jamshoot
--

COPY public.kanban_issues (id, project_id, project_name, kanban_status_id, executor_id, executor_name, issue_id, issue_name, "createdAt", "updatedAt", important_issue, executed_issue, auditor_id, auditor_name) FROM stdin;
7	85	OknoPlus Serwis	1	36	Dmytro Kolomeec	14600	Problem z wymianą 	2021-05-15 10:34:32.899+00	2021-05-15 10:34:32.899+00	\N	\N	\N	\N
24	110	Polgravel	1	104	Volodymyr Danyliuk	14596	Ustawienie numeracji / prefiksacji Raty RMK	2021-05-15 20:53:21.199+00	2021-05-15 20:53:21.199+00	\N	\N	\N	\N
27	110	Polgravel	1	244	Ksenia Świercz	14585	UZUPEŁNIENIE ANALITYKI DO KONT 	2021-05-16 06:10:52.571+00	2021-05-16 06:10:52.571+00	\N	\N	\N	\N
39	85	OknoPlus Serwis	1	32	Dorota  Frączek	14690	DWM- WHnet	2021-06-02 12:38:24.746+00	2021-06-02 12:38:24.746+00	\N	\N	\N	\N
37	81	Droma ERP	1	90	Darina Lipeshko	14689	Zaciąganie terminu płatności	2021-05-27 21:12:23.612+00	2021-05-27 21:12:23.612+00	\N	\N	\N	\N
30	110	Polgravel	2	106	Dmytro Kolomeec	14581	RMK a dowód księgowy	2021-05-16 18:30:40.045+00	2021-05-27 21:24:26.91+00	\N	\N	\N	\N
23	110	Polgravel	4	106	Dmytro Kolomeec	14596	Ustawienie numeracji / prefiksacji Raty RMK	2021-05-15 20:11:58.497+00	2021-05-27 21:24:46.143+00	\N	\N	\N	\N
28	110	Polgravel	2	106	Dmytro Kolomeec	14582	Rejestr Faktura sprzedaży a Konto	2021-05-16 07:55:06.041+00	2021-05-27 21:25:05.493+00	\N	\N	\N	\N
26	110	Polgravel	1	106	Dmytro Kolomeec	14595	Ustawienie numeracji / prefiksacji Faktura wewnętrzna	2021-05-16 06:06:26.355+00	2021-05-27 21:25:59.274+00	\N	\N	\N	\N
3	51	1C Drive	1	163	Yuriy Semenov	14476	1C:Drive PL (1.3.7.8) User story 7686 История номенклатуры	2021-05-13 21:00:39.452+00	2021-06-08 06:44:02.21+00	\N	\N	\N	\N
36	81	Droma ERP	3	163	Yuriy Semenov	14667	Dodatkowe pola do wgrania inwentaryzacji z pliku, usprawnienia w samym dokumencie	2021-05-27 20:30:04.047+00	2021-06-08 19:33:25.091+00	1	\N	\N	\N
38	85	OknoPlus Serwis	1	121	Dominika Musiał	14599	Korekta MM - powoduje to że na magazynie stan < niż stan rezerwacji	2021-06-02 12:29:10.951+00	2021-06-02 12:29:10.951+00	\N	\N	\N	\N
34	85	OknoPlus Serwis	2	163	Yuriy Semenov	14690	DWM- WHnet	2021-05-27 20:16:58.028+00	2021-06-08 19:34:06.041+00	\N	\N	\N	\N
2	51	1C Drive	4	163	Yuriy Semenov	14338	1C:Drive PL (1.3.7.8) USER STORY 7358 Добавить документы соответствующие требованиям учета в Польше	2021-05-13 20:22:24.873+00	2021-06-09 21:03:20.173+00	1	\N	\N	\N
\.


--
-- Data for Name: participants; Type: TABLE DATA; Schema: public; Owner: jamshoot
--

COPY public.participants (id, event_id, participant_id, event_owner, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: jamshoot
--

COPY public.users (id, role, user_status, name, email, redmine_api_key, password, "createdAt", "updatedAt") FROM stdin;
2	\N	1	Olena Gnatyshena	l.gnatishena@gmail.com	33333333333333333333	$2b$12$KhLZUUojPigZURJf.VpT0u3pIVrop9nWdiMH/qcHRJ15q34jYSJvW	2021-05-03 19:59:16.111+00	2021-05-03 20:00:06.259+00
1	1	1	Roman Gnatyshen	r.gnatishen@gmail.com	da6cdf43205b94b68b7d0e2b2433636de96ccb0e	$2b$12$dAB8e6GlffkSWS9VljEdx.42U3bUVBZOVnI6JZfE.eWwyE9vEen0W	2021-04-25 08:00:02.371+00	2021-06-02 03:51:28.08+00
\.


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jamshoot
--

SELECT pg_catalog.setval('public.events_id_seq', 31, true);


--
-- Name: kanban_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jamshoot
--

SELECT pg_catalog.setval('public.kanban_comments_id_seq', 12, true);


--
-- Name: kanban_issues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jamshoot
--

SELECT pg_catalog.setval('public.kanban_issues_id_seq', 39, true);


--
-- Name: participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jamshoot
--

SELECT pg_catalog.setval('public.participants_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jamshoot
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: jamshoot
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: kanban_comments kanban_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: jamshoot
--

ALTER TABLE ONLY public.kanban_comments
    ADD CONSTRAINT kanban_comments_pkey PRIMARY KEY (id);


--
-- Name: kanban_issues kanban_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: jamshoot
--

ALTER TABLE ONLY public.kanban_issues
    ADD CONSTRAINT kanban_issues_pkey PRIMARY KEY (id);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: jamshoot
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: jamshoot
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: jamshoot
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--


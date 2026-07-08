--
-- PostgreSQL database dump
--

\restrict xQFTmcSJ8gpagzEjc51zwrcSyRjdea9ULNOpUcchUTNTUFUWfqfihzLJDN5dHTI

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: expense_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.expense_participants (
    id integer NOT NULL,
    expense_id integer NOT NULL,
    participant_id integer NOT NULL,
    amount_owed numeric(10,2) DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    parts integer
);


--
-- Name: expense_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.expense_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: expense_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.expense_participants_id_seq OWNED BY public.expense_participants.id;


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.expenses (
    id integer NOT NULL,
    group_id integer,
    title character varying(255) NOT NULL,
    amount numeric NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    payer_participant_id integer,
    split_mode character varying(10) DEFAULT 'equal'::character varying NOT NULL,
    expense_date timestamp without time zone DEFAULT now()
);


--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


--
-- Name: group_invites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_invites (
    id integer NOT NULL,
    group_id integer NOT NULL,
    token text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    expires_at timestamp without time zone
);


--
-- Name: group_invites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.group_invites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: group_invites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.group_invites_id_seq OWNED BY public.group_invites.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participants (
    id integer NOT NULL,
    group_id integer NOT NULL,
    name character varying(100) NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: participants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.participants_id_seq OWNED BY public.participants.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    password character varying(255)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: expense_participants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expense_participants ALTER COLUMN id SET DEFAULT nextval('public.expense_participants_id_seq'::regclass);


--
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- Name: group_invites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_invites ALTER COLUMN id SET DEFAULT nextval('public.group_invites_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: participants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants ALTER COLUMN id SET DEFAULT nextval('public.participants_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: expense_participants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.expense_participants (id, expense_id, participant_id, amount_owed, created_at, parts) FROM stdin;
1	1	1	30.00	2026-07-08 15:35:45.195371	\N
2	1	2	30.00	2026-07-08 15:35:45.195371	\N
3	1	3	30.00	2026-07-08 15:35:45.195371	\N
4	1	4	30.00	2026-07-08 15:35:45.195371	\N
5	2	1	109.29	2026-07-08 15:36:12.346771	3
6	2	2	72.86	2026-07-08 15:36:12.346771	2
7	2	3	36.43	2026-07-08 15:36:12.346771	1
8	2	4	36.43	2026-07-08 15:36:12.346771	1
9	3	1	12.00	2026-07-08 15:37:00.435108	\N
10	3	2	6.00	2026-07-08 15:37:00.435108	\N
11	3	3	7.00	2026-07-08 15:37:00.435108	\N
12	4	5	29.00	2026-07-08 15:38:00.005753	\N
13	4	8	29.00	2026-07-08 15:38:00.005753	\N
14	4	9	29.00	2026-07-08 15:38:00.005753	\N
15	5	5	21.00	2026-07-08 15:38:16.813456	\N
16	5	6	21.00	2026-07-08 15:38:16.813456	\N
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.expenses (id, group_id, title, amount, created_at, payer_participant_id, split_mode, expense_date) FROM stdin;
1	1	Courses	120	2026-07-08 15:35:45.195371	1	equal	2026-07-07 00:00:00
2	1	Karting	255	2026-07-08 15:36:12.346771	2	parts	2026-07-07 00:00:00
3	1	Boulangerie	25	2026-07-08 15:37:00.435108	3	exact	2026-07-02 00:00:00
4	2	Essence	87	2026-07-08 15:38:00.005753	5	equal	2026-07-09 00:00:00
5	2	Peage	42	2026-07-08 15:38:16.813456	6	equal	2026-07-06 00:00:00
\.


--
-- Data for Name: group_invites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.group_invites (id, group_id, token, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.groups (id, name, created_at) FROM stdin;
1	Weekend	2026-07-08 15:35:27.359376
2	Vacances	2026-07-08 15:37:44.949644
\.


--
-- Data for Name: participants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.participants (id, group_id, name, user_id, created_at) FROM stdin;
1	1	Charlie	3	2026-07-08 15:35:27.359376
2	1	Bob	\N	2026-07-08 15:35:27.359376
3	1	Alice	\N	2026-07-08 15:35:27.359376
4	1	Joe	\N	2026-07-08 15:35:27.359376
5	2	Charlie	3	2026-07-08 15:37:44.949644
6	2	Bob	\N	2026-07-08 15:37:44.949644
7	2	Joe	\N	2026-07-08 15:37:44.949644
8	2	Alice	\N	2026-07-08 15:37:44.949644
9	2	Claire	\N	2026-07-08 15:37:44.949644
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, created_at, password) FROM stdin;
1	Alice	alice@test.com	2026-07-08 15:34:31.366509	$2b$10$RHPz9HRLVhfg0OSWRmAMm.YzDnTRjXy1rzo/O2HcQtf7SRsJiz5Fq
2	Bob	bob@test.com	2026-07-08 15:34:48.559972	$2b$10$Lq.5ALGFNWgXGgwSjnldUOzEvU9iijM4sf1v.3Eih2ZHZol8UWz8S
3	Charlie	charlie@test.com	2026-07-08 15:35:09.916638	$2b$10$I.ixoeHAa1rlYN376O2ZzOotFprVPcFebb0E.tyOdZ0eD8GAObdyW
\.


--
-- Name: expense_participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.expense_participants_id_seq', 16, true);


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.expenses_id_seq', 5, true);


--
-- Name: group_invites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.group_invites_id_seq', 1, false);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.groups_id_seq', 2, true);


--
-- Name: participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.participants_id_seq', 9, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: expense_participants expense_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expense_participants
    ADD CONSTRAINT expense_participants_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: group_invites group_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_invites
    ADD CONSTRAINT group_invites_pkey PRIMARY KEY (id);


--
-- Name: group_invites group_invites_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_invites
    ADD CONSTRAINT group_invites_token_key UNIQUE (token);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- Name: expense_participants fk_expense; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expense_participants
    ADD CONSTRAINT fk_expense FOREIGN KEY (expense_id) REFERENCES public.expenses(id) ON DELETE CASCADE;


--
-- Name: expense_participants fk_participant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expense_participants
    ADD CONSTRAINT fk_participant FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: expenses fk_payer_participant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT fk_payer_participant FOREIGN KEY (payer_participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: participants participants_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: participants participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict xQFTmcSJ8gpagzEjc51zwrcSyRjdea9ULNOpUcchUTNTUFUWfqfihzLJDN5dHTI


--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

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

--
-- Name: loginmethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loginmethod AS ENUM (
    'Discord'
);


ALTER TYPE public.loginmethod OWNER TO postgres;

--
-- Name: role_name; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_name AS ENUM (
    'admin',
    'ban'
);


ALTER TYPE public.role_name OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: task_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_applications (
    id integer NOT NULL,
    owner integer,
    text text,
    deleted boolean DEFAULT false,
    task_id integer
);


ALTER TABLE public.task_applications OWNER TO postgres;

--
-- Name: task_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.task_applications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.task_applications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title text,
    description text,
    owner integer,
    amount double precision,
    verified boolean DEFAULT true,
    banano_address text,
    banano_seed text,
    uuid text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fee double precision
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tasks ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tasks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    user_id integer,
    role public.role_name,
    created_at timestamp without time zone
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_roles_id_seq OWNER TO postgres;

--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    registered_timestamp timestamp without time zone,
    username text,
    password text,
    email text,
    email_verified boolean,
    registered_ip text,
    registered_country text,
    banano_address text DEFAULT ''::text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: task_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_applications (id, owner, text, deleted, task_id) FROM stdin;
10	12	Wow!!	f	40
11	12	I would like to do this job!	f	37
12	12	etadjjtresgjstrejstestjer	f	43
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, title, description, owner, amount, verified, banano_address, banano_seed, uuid, "timestamp", fee) FROM stdin;
44	*DEMO* Test the Banano Board website!	This is a test task. Just test the website and have fun! *Bounty not available*\n\nSkills required:\n- Some kind of computer machine to open and interact with this website.\n\nFeel free to apply!	12	15159	t	ban_17mzo6iwgent9asjh7rxwpsie9fkt3apfyhon897ju4spoz8yhbewm9aewen	5a0ddbad1be5d2364e6e268dc48d055ca5cbe8f461276a78e81a26d98f8494bc	f1c8219c-8382-4041-88a2-4e213c53f0a0	2023-09-04 02:02:17.011895	170.59
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, user_id, role, created_at) FROM stdin;
1	12	admin	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, registered_timestamp, username, password, email, email_verified, registered_ip, registered_country, banano_address) FROM stdin;
12	2022-12-12 05:20:39.731455	Jeffrey	$2b$10$AkUKmSs/tzWIgry6vinKieHcZaL9PIQSqwvHAjJwAIwmsWnsGpONG	jeffrey@gmail.com	t	127.0.0.1	UNKNOWN	ban_3xxxxxxxcscz1xuu9yno31bu5hj67qgoyjq4419j8tbxzbs59ogbd4grc46s
\.


--
-- Name: task_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.task_applications_id_seq', 12, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 44, true);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: tasks tasks_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pk PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--


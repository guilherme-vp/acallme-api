DROP TABLE t_clg_paciente                   CASCADE CONSTRAINTS;
DROP TABLE t_clg_especialista               CASCADE CONSTRAINTS;
DROP TABLE t_clg_especialidade              CASCADE CONSTRAINTS;
DROP TABLE t_clg_especialista_especialidade CASCADE CONSTRAINTS;
DROP TABLE t_clg_agenda                     CASCADE CONSTRAINTS;
DROP TABLE t_clg_chamada                    CASCADE CONSTRAINTS;
DROP TABLE t_clg_prontuario                 CASCADE CONSTRAINTS;

CREATE TABLE t_clg_paciente (
    cd_paciente        NUMBER GENERATED ALWAYS AS IDENTITY,
    nm_paciente        VARCHAR2(50) NOT NULL,
    ds_email           VARCHAR2(50) NOT NULL,
    ds_senha           VARCHAR2(75) NOT NULL,
    dt_nascimento      DATE NOT NULL,
    ds_genero          VARCHAR2(2) NOT NULL,
    ds_avatar_url 		 VARCHAR2(100),
    nr_cpf             NUMBER(9) NOT NULL,
    nr_cpf_digito      NUMBER(2) NOT NULL,
    nr_telefone        NUMBER(9) NOT NULL,
    nr_telefone_ddd    NUMBER(2) NOT NULL
);

CREATE TABLE t_clg_especialista (
    cd_especialista        NUMBER GENERATED ALWAYS AS IDENTITY,
    nm_especialista        VARCHAR2(50) NOT NULL,
    ds_email               VARCHAR2(50) NOT NULL,
    ds_senha               VARCHAR2(75) NOT NULL,
    nr_telefone            NUMBER(9) NOT NULL,
    nr_telefone_ddd        NUMBER(2) NOT NULL,
    dt_nascimento          DATE NOT NULL,
    ds_genero              VARCHAR2(2) NOT NULL,
    ds_sobre               VARCHAR2(300),
    ds_avatar_url 		     VARCHAR2(100),
    vl_consulta            NUMBER(4,2) NOT NULL,
    nr_cnpj                NUMBER(12),
    nr_cnpj_digito         NUMBER(2),
    nr_cpf                 NUMBER(9),
    nr_cpf_digito          NUMBER(2),
    nr_crp                 NUMBER(20),
    nr_crm                 NUMBER(20)
);

CREATE TABLE t_clg_especialidade (
    cd_especialidade NUMBER GENERATED ALWAYS AS IDENTITY,
    tp_especialidade VARCHAR2(30) NOT NULL
);

CREATE TABLE t_clg_especialista_especialidade (
    cd_especialidade NUMBER(5) NOT NULL,
    cd_especialista  NUMBER(5) NOT NULL
);

CREATE TABLE t_clg_agenda (
    cd_agenda       NUMBER GENERATED ALWAYS AS IDENTITY,
    cd_especialista NUMBER(5) NOT NULL,
    cd_paciente     NUMBER(5),
    dt_ini_range    DATE NOT NULL,
    dt_fim_range    DATE NOT NULL,
    vl_confirmado   NUMBER(1)
);

CREATE TABLE t_clg_chamada (
    cd_chamada    NUMBER GENERATED ALWAYS AS IDENTITY,
    cd_agenda     NUMBER(5) NOT NULL,
    cd_prontuario NUMBER(5) NOT NULL,
    vl_duracao    NUMBER(4, 2) NOT NULL,
    vl_avaliacao  FLOAT(2)
);

CREATE TABLE t_clg_prontuario (
    cd_prontuario  NUMBER GENERATED ALWAYS AS IDENTITY,
    cd_chamada     NUMBER(5) NOT NULL,
    ds_observacao  VARCHAR2(100),
    ds_diagnostico VARCHAR2(100) NOT NULL
);

ALTER TABLE t_clg_agenda ADD CONSTRAINT pk_clg_agenda PRIMARY KEY ( cd_agenda );

ALTER TABLE t_clg_chamada ADD CONSTRAINT t_clg_chamada_ck_1 CHECK ( vl_avaliacao < 5 );

ALTER TABLE t_clg_chamada ADD CONSTRAINT pk_clg_chamada PRIMARY KEY ( cd_chamada );

ALTER TABLE t_clg_especialidade ADD CONSTRAINT pk_clg_especialidade PRIMARY KEY ( cd_especialidade );

ALTER TABLE t_clg_especialista ADD CONSTRAINT pk_clg_especialista PRIMARY KEY ( cd_especialista );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_cpf UNIQUE ( nr_cpf,
                                                                               nr_cpf_digito );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_cnpj UNIQUE ( nr_cnpj,
                                                                                nr_cnpj_digito );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_crm UNIQUE ( nr_crm );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_crp UNIQUE ( nr_crp );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_email UNIQUE ( ds_email );

ALTER TABLE t_clg_paciente ADD CONSTRAINT pk_clg_paciente PRIMARY KEY ( cd_paciente );

ALTER TABLE t_clg_paciente ADD CONSTRAINT un_clg_paciente_email UNIQUE ( ds_email );

ALTER TABLE t_clg_paciente ADD CONSTRAINT un_clg_paciente_cpf UNIQUE ( nr_cpf,
                                                                       nr_cpf_digito );

ALTER TABLE t_clg_prontuario ADD CONSTRAINT pk_clg_prontuario PRIMARY KEY ( cd_prontuario );

ALTER TABLE t_clg_especialista_especialidade
    ADD CONSTRAINT fk_clg_especialista_especialidade FOREIGN KEY ( cd_especialista )
        REFERENCES t_clg_especialista ( cd_especialista );

ALTER TABLE t_clg_especialista_especialidade
    ADD CONSTRAINT fk_clg_especialidade_especialista FOREIGN KEY ( cd_especialidade )
        REFERENCES t_clg_especialidade ( cd_especialidade );

ALTER TABLE t_clg_agenda
    ADD CONSTRAINT fk_clg_agenda_especialista FOREIGN KEY ( cd_especialista )
        REFERENCES t_clg_especialista ( cd_especialista );

ALTER TABLE t_clg_agenda
    ADD CONSTRAINT fk_clg_agenda_paciente FOREIGN KEY ( cd_paciente )
        REFERENCES t_clg_paciente ( cd_paciente );

ALTER TABLE t_clg_chamada
    ADD CONSTRAINT fk_clg_chamada_agenda FOREIGN KEY ( cd_agenda )
        REFERENCES t_clg_agenda ( cd_agenda );

ALTER TABLE t_clg_prontuario
    ADD CONSTRAINT fk_clg_prontuario_chamada FOREIGN KEY ( cd_chamada )
        REFERENCES t_clg_chamada ( cd_chamada );

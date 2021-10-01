-- DROP TABLE t_clg_agenda_especialista CASCADE CONSTRAINTS;
-- DROP TABLE t_clg_agenda_paciente CASCADE CONSTRAINTS;
-- DROP TABLE t_clg_chamada CASCADE CONSTRAINTS;
-- DROP TABLE t_clg_consulta CASCADE CONSTRAINTS;
-- DROP TABLE t_clg_especialidade CASCADE CONSTRAINTS;
-- DROP TABLE t_clg_especialista CASCADE CONSTRAINTS;
-- DROP TABLE t_clg_especializar CASCADE CONSTRAINTS;
-- DROP TABLE t_clg_paciente CASCADE CONSTRAINTS;
-- DROP TABLE t_clg_prontuario CASCADE CONSTRAINTS;

CREATE TABLE t_clg_agenda_especialista (
    cd_agenda_especialista NUMBER GENERATED ALWAYS AS IDENTITY,
    cd_especialista        NUMBER(5) NOT NULL
);

CREATE TABLE t_clg_agenda_paciente (
    cd_agenda_paciente NUMBER GENERATED ALWAYS AS IDENTITY,
    cd_paciente        NUMBER(5) NOT NULL
);

CREATE TABLE t_clg_chamada (
    cd_chamada   NUMBER GENERATED ALWAYS AS IDENTITY,
    cd_consulta  NUMBER(5) NOT NULL,
    vl_duracao   NUMBER(4, 2) NOT NULL,
    vl_avaliacao FLOAT(2)
);

CREATE TABLE t_clg_consulta (
    cd_consulta            NUMBER GENERATED ALWAYS AS IDENTITY,
    cd_prontuario          NUMBER(5) NOT NULL,
    cd_agenda_paciente     NUMBER(5) NOT NULL,
    cd_agenda_especialista NUMBER(5) NOT NULL,
    vl_consulta            NUMBER(8, 2) NOT NULL,
    dt_consulta            DATE NOT NULL
);

CREATE TABLE t_clg_especialidade (
    cd_especialidade NUMBER GENERATED ALWAYS AS IDENTITY,
    tp_especialidade VARCHAR2(30) NOT NULL
);

CREATE TABLE t_clg_especialista (
    cd_especialista        NUMBER GENERATED ALWAYS AS IDENTITY,
    cd_agenda_especialista NUMBER(5),
    nm_especialista        VARCHAR2(50) NOT NULL,
    ds_email               VARCHAR2(50) NOT NULL,
    ds_senha               VARCHAR2(30) NOT NULL,
    dt_nascimento          DATE NOT NULL,
    ds_genero              VARCHAR2(2) NOT NULL,
    nr_cnpj                NUMBER(12),
    nr_cnpj_digito         NUMBER(2),
    nr_cpf                 NUMBER(9),
    nr_cpf_digito          NUMBER(2),
    nr_telefone            NUMBER(9) NOT NULL,
    nr_telefone_ddd        NUMBER(2) NOT NULL,
    nr_crp                 NUMBER(20),
    nr_crm                 NUMBER(20)
);

CREATE TABLE t_clg_especializar (
    cd_especialidade NUMBER(5) NOT NULL,
    cd_especialista  NUMBER(5) NOT NULL
);

CREATE TABLE t_clg_paciente (
    cd_paciente        NUMBER GENERATED ALWAYS AS IDENTITY,
    cd_agenda_paciente NUMBER(5),
    nm_paciente        VARCHAR2(50) NOT NULL,
    ds_email           VARCHAR2(50) NOT NULL,
    ds_senha           VARCHAR2(30) NOT NULL,
    dt_nascimento      DATE NOT NULL,
    ds_genero          VARCHAR2(2) NOT NULL,
    nr_cpf             NUMBER(9) NOT NULL,
    nr_cpf_digito      NUMBER(2) NOT NULL,
    nr_telefone        NUMBER(9) NOT NULL,
    nr_telefone_ddd    NUMBER(2) NOT NULL
);

CREATE TABLE t_clg_prontuario (
    cd_prontuario  NUMBER GENERATED ALWAYS AS IDENTITY,
    cd_consulta    NUMBER(5) NOT NULL,
    dt_prontuario  DATE NOT NULL,
    ds_observacao  VARCHAR2(100),
    ds_diagnostico VARCHAR2(100) NOT NULL
);

ALTER TABLE t_clg_agenda_paciente ADD CONSTRAINT pk_clg_agenda_paciente PRIMARY KEY ( cd_agenda_paciente );

ALTER TABLE t_clg_agenda_especialista ADD CONSTRAINT pk_clg_agenda_especialista PRIMARY KEY ( cd_agenda_especialista );

ALTER TABLE t_clg_chamada ADD CONSTRAINT t_clg_chamada_ck_1 CHECK ( vl_avaliacao < 5 );

ALTER TABLE t_clg_chamada ADD CONSTRAINT pk_clg_chamada PRIMARY KEY ( cd_chamada );

ALTER TABLE t_clg_consulta ADD CONSTRAINT ck_clg_consulta_ CHECK ( vl_consulta > 0 );

ALTER TABLE t_clg_consulta ADD CONSTRAINT pk_clg_consulta PRIMARY KEY ( cd_consulta );

ALTER TABLE t_clg_especialidade ADD CONSTRAINT pk_clg_especialidade PRIMARY KEY ( cd_especialidade );

ALTER TABLE t_clg_especialista ADD CONSTRAINT pk_clg_especialista PRIMARY KEY ( cd_especialista );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_cpf UNIQUE ( nr_cpf,
                                                                               nr_cpf_digito );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_cnpj UNIQUE ( nr_cnpj,
                                                                                nr_cnpj_digito );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_crm UNIQUE ( nr_crm );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_crp UNIQUE ( nr_crp );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_email UNIQUE ( ds_email );

ALTER TABLE t_clg_especializar ADD CONSTRAINT pk_clg_especializar PRIMARY KEY ( cd_especialidade,
                                                                                cd_especialista );

ALTER TABLE t_clg_paciente ADD CONSTRAINT pk_clg_paciente PRIMARY KEY ( cd_paciente );

ALTER TABLE t_clg_paciente ADD CONSTRAINT un_clg_paciente_email UNIQUE ( ds_email );

ALTER TABLE t_clg_paciente ADD CONSTRAINT un_clg_paciente_cpf UNIQUE ( nr_cpf,
                                                                       nr_cpf_digito );

ALTER TABLE t_clg_prontuario ADD CONSTRAINT pk_clg_prontuario PRIMARY KEY ( cd_prontuario );

ALTER TABLE t_clg_agenda_especialista
    ADD CONSTRAINT fk_clg_agenda_especialista_esp FOREIGN KEY ( cd_especialista )
        REFERENCES t_clg_especialista ( cd_especialista );

ALTER TABLE t_clg_agenda_paciente
    ADD CONSTRAINT fk_clg_agenda_paciente_pac FOREIGN KEY ( cd_paciente )
        REFERENCES t_clg_paciente ( cd_paciente );

ALTER TABLE t_clg_chamada
    ADD CONSTRAINT fk_clg_chamada_consulta FOREIGN KEY ( cd_consulta )
        REFERENCES t_clg_consulta ( cd_consulta );

ALTER TABLE t_clg_consulta
    ADD CONSTRAINT fk_clg_consulta_agenda_esp FOREIGN KEY ( cd_agenda_especialista )
        REFERENCES t_clg_agenda_especialista ( cd_agenda_especialista );

ALTER TABLE t_clg_consulta
    ADD CONSTRAINT fk_clg_consulta_agenda_pac FOREIGN KEY ( cd_agenda_paciente )
        REFERENCES t_clg_agenda_paciente ( cd_agenda_paciente );

ALTER TABLE t_clg_consulta
    ADD CONSTRAINT fk_clg_consulta_prontuario FOREIGN KEY ( cd_prontuario )
        REFERENCES t_clg_prontuario ( cd_prontuario );

ALTER TABLE t_clg_especialista
    ADD CONSTRAINT fk_clg_especialista_agenda_esp FOREIGN KEY ( cd_agenda_especialista )
        REFERENCES t_clg_agenda_especialista ( cd_agenda_especialista );

ALTER TABLE t_clg_especializar
    ADD CONSTRAINT fk_clg_especializar_esp FOREIGN KEY ( cd_especialista )
        REFERENCES t_clg_especialista ( cd_especialista );

ALTER TABLE t_clg_especializar
    ADD CONSTRAINT fk_clg_especializar_espec FOREIGN KEY ( cd_especialidade )
        REFERENCES t_clg_especialidade ( cd_especialidade );

ALTER TABLE t_clg_paciente
    ADD CONSTRAINT fk_clg_paciente_agenda_paciente FOREIGN KEY ( cd_agenda_paciente )
        REFERENCES t_clg_agenda_paciente ( cd_agenda_paciente );

ALTER TABLE t_clg_prontuario
    ADD CONSTRAINT fk_clg_prontuario_consulta FOREIGN KEY ( cd_consulta )
        REFERENCES t_clg_consulta ( cd_consulta );

CREATE SCHEMA IF NOT EXISTS acallme;
USE acallme;

SET foreign_key_checks=0;

DROP TABLE IF EXISTS t_clg_agenda CASCADE;
DROP TABLE IF EXISTS t_clg_chamada CASCADE;
DROP TABLE IF EXISTS t_clg_especialidade CASCADE;
DROP TABLE IF EXISTS t_clg_especialista CASCADE;
DROP TABLE IF EXISTS t_clg_especialista_especialidade CASCADE;
DROP TABLE IF EXISTS t_clg_paciente CASCADE;
DROP TABLE IF EXISTS t_clg_prontuario CASCADE;

CREATE TABLE t_clg_agenda (
    cd_agenda       INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cd_chamada      INTEGER,
    cd_especialista INTEGER NOT NULL,
    cd_paciente     INTEGER,
    dt_ini_range    DATETIME(6) NOT NULL,
    dt_fim_range    DATETIME(6) NOT NULL,
    vl_confirmado   TINYINT,
    nr_desabilitado TINYINT
);

CREATE TABLE t_clg_chamada (
    cd_chamada    INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cd_agenda     INTEGER NOT NULL,
    cd_prontuario INTEGER,
    vl_duracao    DECIMAL(4, 2),
    vl_avaliacao  DECIMAL(1,1)
);

CREATE TABLE t_clg_especialidade (
    cd_especialidade INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tp_especialidade VARCHAR(30) NOT NULL
);

CREATE TABLE t_clg_especialista (
    cd_especialista INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nm_especialista VARCHAR(50) NOT NULL,
    ds_email        VARCHAR(50) NOT NULL,
    ds_senha        VARCHAR(75) NOT NULL,
    nr_telefone     BIGINT NOT NULL,
    nr_telefone_ddd TINYINT NOT NULL,
    dt_nascimento   DATE NOT NULL,
    ds_genero       VARCHAR(2) NOT NULL,
    ds_sobre        VARCHAR(1000),
    im_avatar_url   VARCHAR(200),
    vl_consulta     DECIMAL(5, 2) NOT NULL,
    nr_cnpj         BIGINT,
    nr_cnpj_digito  TINYINT,
    nr_cpf          BIGINT,
    nr_cpf_digito   TINYINT,
    nr_crp          DECIMAL(20),
    nr_crm          DECIMAL(20)
);

CREATE TABLE t_clg_especialista_especialidade (
    cd_especialidade INTEGER NOT NULL,
    cd_especialista  INTEGER NOT NULL
);

CREATE TABLE t_clg_paciente (
    cd_paciente     INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nm_paciente     VARCHAR(50) NOT NULL,
    ds_email        VARCHAR(50) NOT NULL,
    ds_senha        VARCHAR(75) NOT NULL,
    dt_nascimento   DATE NOT NULL,
    ds_genero       VARCHAR(2) NOT NULL,
    im_avatar_url   VARCHAR(200),
    nr_cpf          BIGINT NOT NULL,
    nr_cpf_digito   TINYINT NOT NULL,
    nr_telefone     BIGINT NOT NULL,
    nr_telefone_ddd TINYINT NOT NULL
);

CREATE TABLE t_clg_prontuario (
    cd_prontuario  INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cd_chamada     INTEGER,
    ds_observacao  VARCHAR(100),
    ds_diagnostico VARCHAR(100) NOT NULL
);

ALTER TABLE t_clg_chamada ADD CONSTRAINT t_clg_chamada_ck_1 CHECK ( vl_avaliacao < 5 );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_cnpj UNIQUE ( nr_cnpj );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_cpf UNIQUE ( nr_cpf );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_crm UNIQUE ( nr_crm );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_crp UNIQUE ( nr_crp );

ALTER TABLE t_clg_especialista ADD CONSTRAINT un_clg_especialista_email UNIQUE ( ds_email );

ALTER TABLE t_clg_paciente ADD CONSTRAINT un_clg_paciente_cpf UNIQUE ( nr_cpf );

ALTER TABLE t_clg_paciente ADD CONSTRAINT un_clg_paciente_email UNIQUE ( ds_email );

ALTER TABLE t_clg_agenda
    ADD CONSTRAINT fk_clg_agenda_chamada FOREIGN KEY ( cd_chamada )
        REFERENCES t_clg_chamada ( cd_chamada )
            ON DELETE CASCADE;

ALTER TABLE t_clg_agenda
    ADD CONSTRAINT fk_clg_agenda_especialista FOREIGN KEY ( cd_especialista )
        REFERENCES t_clg_especialista ( cd_especialista )
						ON DELETE CASCADE;

ALTER TABLE t_clg_agenda
    ADD CONSTRAINT fk_clg_agenda_paciente FOREIGN KEY ( cd_paciente )
        REFERENCES t_clg_paciente ( cd_paciente )
						ON DELETE CASCADE;

ALTER TABLE t_clg_chamada
    ADD CONSTRAINT fk_clg_chamada_agenda FOREIGN KEY ( cd_agenda )
        REFERENCES t_clg_agenda ( cd_agenda )
            ON DELETE CASCADE;

ALTER TABLE t_clg_chamada
    ADD CONSTRAINT fk_clg_chamada_prontuario FOREIGN KEY ( cd_prontuario )
        REFERENCES t_clg_prontuario ( cd_prontuario )
            ON DELETE CASCADE;

ALTER TABLE t_clg_especialista_especialidade
    ADD CONSTRAINT fk_clg_especialista_especialidade FOREIGN KEY ( cd_especialidade )
        REFERENCES t_clg_especialidade ( cd_especialidade )
						ON DELETE CASCADE;

ALTER TABLE t_clg_especialista_especialidade
    ADD CONSTRAINT fk_clg_especialidade_especialista FOREIGN KEY ( cd_especialista )
        REFERENCES t_clg_especialista ( cd_especialista )
						ON DELETE CASCADE;

ALTER TABLE t_clg_prontuario
    ADD CONSTRAINT fk_clg_prontuario_chamada FOREIGN KEY ( cd_chamada )
        REFERENCES t_clg_chamada ( cd_chamada )
            ON DELETE CASCADE;

SET foreign_key_checks=1;
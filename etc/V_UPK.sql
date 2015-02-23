create or replace view V_UPK as select SHAPE,ADDRESS,BOROUGH,DAY_LENGTH,NAME,PHONE,PREK_TYPE,SEATS,ZIP from upk;


select * from user_sdo_geom_metadata where table_name like '%UPK';

insert into user_sdo_geom_metadata select 'V_UPK', 'SHAPE', diminfo, srid from  user_sdo_geom_metadata where table_name = 'UPK';


@echo OFF
:START
set/p _CONFIRM="ȷ��Ҫ�������ļ���?��y/n)"
if %_CONFIRM%==Y GOTO PACKET
if %_CONFIRM%==y GOTO PACKET
if %_CONFIRM%==N GOTO QUIT
if %_CONFIRM%==n GOTO QUIT

:PACKET
set packet_name=dsm-web-%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%.zip
ECHO ������ļ��� file %packet_name%
set release_path=D:\dsm_data\dsm_relase
if not exist %release_path% md %release_path%
cd %release_path%
set bulid_path=D:\Project\dsm_bulid\*
HaoZipC a -tzip %packet_name% %bulid_path% -r
set/p _FTP_CONFIRM="�Ƿ��ϴ���ftp?��y/n)"
if %_CONFIRM%==N GOTO QUIT
if %_CONFIRM%==n GOTO QUIT
ECHO ���ϴ���ftp��
lftp user:123@192.168.1.250/�з�����/�����/WEB�汾����/ -e "put %packet_name%;bye;"
PAUSE
:QUIT
 ECHO exit...
 GOTO END
:END


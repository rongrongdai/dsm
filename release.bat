@echo OFF
:START
echo 1.������ 2.��ʽ�棨�ļ���md5��ѹ����3.��ʽ�棨ѹ���� 
set/p _CONFIRM="�����뷢���汾��"
if %_CONFIRM%==1 GOTO PACKET
if %_CONFIRM%==2 GOTO PACKET
if %_CONFIRM%==3 GOTO PACKET
if %_CONFIRM%==0 GOTO QUIT
GOTO START
:PACKET
set temp_dir=D:/Project/dsm_bulid
ECHO ���Ŀ¼�� %temp_dir%
if exist %temp_dir% rd /s /q %temp_dir%
echo %temp_dir%
PAUSE
ECHO ����������
if %_CONFIRM%==1 fis release -c -d %temp_dir%
if %_CONFIRM%==2 fis release -o -m -c -d %temp_dir%
if %_CONFIRM%==3 fis release -o -c -d %temp_dir%
PAUSE
:QUIT
 ECHO exit...
 GOTO END
:END


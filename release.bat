@echo OFF
:START
echo 1.开发版 2.正式版（文件名md5、压缩）3.正式版（压缩） 
set/p _CONFIRM="请输入发布版本："
if %_CONFIRM%==1 GOTO PACKET
if %_CONFIRM%==2 GOTO PACKET
if %_CONFIRM%==3 GOTO PACKET
if %_CONFIRM%==0 GOTO QUIT
GOTO START
:PACKET
set temp_dir=D:/Project/dsm_bulid
ECHO 清除目录： %temp_dir%
if exist %temp_dir% rd /s /q %temp_dir%
echo %temp_dir%
PAUSE
ECHO 发布处理中
if %_CONFIRM%==1 fis release -c -d %temp_dir%
if %_CONFIRM%==2 fis release -o -m -c -d %temp_dir%
if %_CONFIRM%==3 fis release -o -c -d %temp_dir%
PAUSE
:QUIT
 ECHO exit...
 GOTO END
:END


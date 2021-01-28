@echo off
REM build using NPM, then copy to local framed site source repo, then call to the commit on that repo which will 
REM deploy it further.
echo Building HoF
pushd .
call build.cmd
popd

echo Removing old build assets
REM ditch all build files in the local framed site source repo
del /q ..\FramedSCSiteSource\markdown\HallOfFramed\*.*

echo "Copying new build assets"
pushd .
REM copy the new built assets
robocopy .\build ..\FramedSCSiteSource\markdown\HallOfFramed\ /s /e
popd

@echo off
REM build using NPM, then copy to local framed site source repo, then call to the commit on that repo which will 
REM deploy it further. Pass the commit message for the site source repo as first argument.
echo Building HoF
pushd .
cmd /c "npm run build"
popd

echo Removing old build assets
REM ditch all build files in the local framed site source repo
del /q ..\FramedCSSiteSource\markdown\HallOfFramed\*.*

echo "Copying new build assets"
pushd .
REM copy the new built assets
robocopy .\build ..\FramedCSSiteSource\markdown\HallOfFramed\ /s /e
popd

echo "Deploying new framed sc site"
REM ... and commit!
call "..\FramedSCSitesource\commitanddeploy.cmd" %1
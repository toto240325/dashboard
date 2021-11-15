# Usage : 
# bash release.sh
# this will 
# - check that this is the develop branch
# - display all existing tags
# - ask for tag of this new version
# - tag this (develop) branch with the given tag
# - merge the current (develop) branch with master and push it to origin
# prerequisite
# - you are in the right (development) directory
# - the code is ready to be committed

# if [ $# -eq 0 ]
#   then
#     echo "Usage : bash release.sh <tag>"
#     exit
# fi
# tag=$1

# check this is the develop branch
branch=`git status | awk '/On branch/ {print $3}'`

if [ $branch != "develop" ]
    then   
        echo "Current branch is $branch while it should be develop"
        echo "Aborting"
        exit
fi

# show git status and tags, and ask for the new tag
git status
echo ""
echo "Current tags"
git tag
echo "Releasing this new version from current branch : $branch"
echo "I am going to commit all, tag it with the new tag, merge into master and push to origin"
echo "Enter a new tag to continue or 'n' to abort"
read tag

if [[ "$tag" == [nN] ]]
    then
        echo "Aborting"
        exit
fi
echo "Tagging new version with $tag"
echo $tag > version.txt
# pushing current branch to origin
git commit -a -m "$tag"
git push --set-upstream origin $branch
git pull
git push

git checkout master
git merge develop -m "$tag"
git pull
git push

git tag "$tag"
git push --tag


# let's avoid this next step by assuming we have just committed the latest version
# #check last version
# #git log --decorate --all --oneline  | grep tag | head -n 1 | awk '{print $2}' FS='tag: ' | awk '{ print $1}' FS=',' | sudo tee /opt/watchdog/version.txt
# git tag | tail -n 1 > version.tmp
# git checkout `cat version.tmp`

# let's get back to branch develop and continue developments
git checkout develop

echo ""
echo "Host on which you'd like to deploy the latest version ? (return for none)"
read host

if [ "$host" == "" ]
    then
        echo "Aborting"
        exit
fi

echo "Deploying on host $host"

ssh $host "curl -L https://api.github.com/repos/toto240325/dashboard/tarball | sudo tar xzvf - --one-top-level=/opt/frigo --strip-components 1"


exit

# after the release has been created in Github, it can be downloaded on the target node like this :
ssh sd3 "curl -L https://api.github.com/repos/toto240325/dashboard/tarball | tar xzvf - --one-top-level=/var/www/event --strip-components 1"


ssh sd8 "sudo mkdir -p /var/www/event/"
ssh sd8 "sudo git clone --depth 1 https://github.com/toto240325/event.git"


scp -v params.php sd8:/var/www/event/
scp -rv {api,config,models,version.tmp} sd8:/var/www/event/
#sudo cp -v params.php /var/www/event/
#sudo vi /var/www/event/params.php

rm version.tmp

# checkout master again (current version is not master)
git checkout master

# sudo su
# . /opt/venv/watchdog_prod/bin/activate
# cd /opt/watchdog
# pip install -r requirements.txt
# python watchdog.py

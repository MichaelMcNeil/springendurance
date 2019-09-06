---
layout: post
title: "Learning to Minecraft Admin"
date: 2019-09-02
categories: ubuntu linux minecraft admin server
---

The past six months have been largely consumed with a new business venture. Check out [www.springendurance.com](http://springendurance.com) to see what's up. I've started coaching athletes, mostly runners. I'm hoping to start coaching triathletes as well.

This past week a friend of mine decided to start a new minecraft server and I thought I'd admin it as a side project.

I created a few scripts (with help from the internet) to start the server and perform regular backups. Here's a snippet of what I've done so far. (also, I realize this seems basic...but I've been off the blogging grid for a quick minute and I'm trying to inspire myself to get back into it (-: )

To keep the minecraft server up and running, a screen session is initiated. The server call gets fired inside a loop so whether the server dies unnaturally, or the /stop command is given in the minecraft console, the session will fire the call again.

{% highlight shell %}
#!/bin/sh
screen -S "Minecraft" bash -c "sh /root/minecraft/loop.sh"
{% endhighlight %}

But just in case the admin wants to stop the server, a 5 second sleep is provided so that the process can be exited manually.

{% highlight shell %}
#!/bin/sh
while true
do
sudo java -Xmx1900M -jar minecraft_server.jar nogui
echo "If you want to completely stop the server process now, press Ctrl+C before the time is up!"
echo "Rebooting in:"
for i in 5 4 3 2 1
do
echo "\$i..."
sleep 1
done
echo "Rebooting now!"
done
{% endhighlight %}

TODO: make sure that the "Minecraft" screen session is iniated on server start.

Next, I wanted to make sure that the minecraft directory is regularly backed up on the occassion someone joins and makes a mess of things.

Console commands can be executed on the minecraft server by sending them to the screen session in the -X parameter. Before the backup begins, users on the server are notified that a backup is beginning and that Minecrafts auto-save feature will be turned off. Because I'm going to run this backup command hourly as a cron job, I'll compress the minecraft folder into a tarball and keep the last 24 compressions (\*actually 25). Every hour the compressions will be renamed, making it easy to see how many hours ago a backup was created. Finally, I'll turn minecrafts auto-save back on and let the server know that backup it completed.

{% highlight shell %}
screen -S Minecraft -X stuff "say Backup starting. World no longer saving...don't do anything crazy (-: $(printf '\r')"
screen -S Minecraft -X stuff "save-off $(printf '\r')"
screen -S Minecraft -X stuff "save-all \$(printf '\r')"
sleep 3

cd /root/minecraft/backups
rm -f minecraft.tar.gz.24
mv minecraft-hour23.tar.gz minecraft-hour24.tar.gz
mv minecraft-hour22.tar.gz minecraft-hour23.tar.gz
mv minecraft-hour21.tar.gz minecraft-hour22.tar.gz
mv minecraft-hour20.tar.gz minecraft-hour21.tar.gz
mv minecraft-hour19.tar.gz minecraft-hour20.tar.gz
mv minecraft-hour18.tar.gz minecraft-hour19.tar.gz
mv minecraft-hour17.tar.gz minecraft-hour18.tar.gz
mv minecraft-hour16.tar.gz minecraft-hour17.tar.gz
mv minecraft-hour15.tar.gz minecraft-hour16.tar.gz
mv minecraft-hour14.tar.gz minecraft-hour15.tar.gz
mv minecraft-hour13.tar.gz minecraft-hour14.tar.gz
mv minecraft-hour12.tar.gz minecraft-hour13.tar.gz
mv minecraft-hour11.tar.gz minecraft-hour12.tar.gz
mv minecraft-hour10.tar.gz minecraft-hour11.tar.gz
mv minecraft-hour9.tar.gz minecraft-hour10.tar.gz
mv minecraft-hour8.tar.gz minecraft-hour9.tar.gz
mv minecraft-hour7.tar.gz minecraft-hour8.tar.gz
mv minecraft-hour6.tar.gz minecraft-hour7.tar.gz
mv minecraft-hour5.tar.gz minecraft-hour6.tar.gz
mv minecraft-hour4.tar.gz minecraft-hour5.tar.gz
mv minecraft-hour3.tar.gz minecraft-hour4.tar.gz
mv minecraft-hour2.tar.gz minecraft-hour3.tar.gz
mv minecraft-hour1.tar.gz minecraft-hour2.tar.gz
mv minecraft-hour0.tar.gz minecraft-hour1.tar.gz

tar -cpvzf /root/minecraft/backups/minecraft-hour0.tar.gz /root/minecraft

screen -S Minecraft -X stuff "save-on $(printf '\r')"
screen -S Minecraft -X stuff "say Backup complete. YEeEeET!. $(printf '\r')"
{% endhighlight %}

To schedule the backup script to run hourly...

{% highlight shell %}
crontab -e
{% endhighlight %}

This edits the files located at /var/spool/cron/crontabs.

Simply add the following line and the server takes care of the rest.

{% highlight shell %}
@hourly /root/minecraft/backup.sh
{% endhighlight %}

I've got a little bit (actually A LOT) more to learn about minecraft server maintenance, but I think it's going to be a fun little side project.

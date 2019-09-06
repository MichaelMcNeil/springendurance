---
layout: post
title: "So your stuck in GRUB Rescue..."
date: 2019-02-27
categories: ubuntu linux grub
---

So the other day I sat down at Starbucks to write code, but my Ubuntu 18 machine was stuck in GRUB Rescue.

After searching and searching (on my phone), I finally found [a quick and easy solution](http://www.linuxandubuntu.com/home/ways-to-rescue-or-recover-grub-menu)!

First, see what partitions are installed on grub.

{% highlight shell %}
ls
{% endhighlight %}

Run the following for the partition your linux OS is running on. If you aren't sure, try tabbing for the /boot/grub directory on each.

{% highlight shell %}
set prefix=(hd0,msdos1)/boot/grub
{% endhighlight %}

Then...

{% highlight shell %}
insmod normal
normal
{% endhighlight %}

My machine rebooted and I was able to repair grub with...

{% highlight shell %}
sudo update-grub
sudo grub-install /dev/sda
{% endhighlight %}

If you end up stuck like me, hopefully you can find help faster than I did! :)

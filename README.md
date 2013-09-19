
# CorMVC - Client-Side jQuery And JavaScript Framework

by [Ben Nadel][1] (on [Google+][2])

*__NOTE:__ This is a really old project that has not been updated in years. I
have personally started to use Google's AngularJS and highly recommend it.*

CorMVC is a jQuery-powered Model-View-Controller (MVC) framework that can 
aide in the development of single-page jQuery applications. It evolved out of
my recent presentation, [Building Single-Page Applications Using jQuery And ColdFusion][3],
and will continue to evolve as I think more deeply about this type of
application architecture.

CorMVC stands for: Client-Only-Required Model-View-Controller, and is my 
laboratory experiment in application architecture held completely seperate
from server-side technologies.

## corMVC Philosophy

Building frameworks in jQuery (or any other language for that matter) is very
new to me; I don't claim to be any good at it. In fact, when I started looking 
into jQuery-based frameworks, I had no intention of creating my own. As I
started to do my research, however, I quickly encountered two major problems 
with what was avilable:

* Most examples were so small that I could not see how they might be applied 
to the kind of software I build.
* Most frameworks were enormous and required command line utilities and some
additional server-side technology (like Ruby On Rails) just to experiment with.

I didn't even know how to begin learning. So, rather than wade through what was
available, I decided to try and create something from scratch. What I came up 
with is corMVC. The philosophies that I put into the corMVC framework are those 
that were hopefully a remedy to the problems I encoutered above:

* __A large sample application__. This whole demo site (including the contacts 
section) runs off of corMVC as a single-page application.
* __No server required__. This demo application does not require any additional
server-side technologies. If you have a web browser, you can download and run
this application immediately.
* __No building required__. This framework does not require you to build the
application using scaffolding or any other command-line executables. You just
download it and open it up in a browser.
* __Small Framework__. This framework is very small (and excessively 
commented). It doesn't do anything more than it is supposed to.

While I want to keep the corMVC framework as small as possible, I am sure that
as I begin to more fully understand the various needs of single-page
applications, the framework will have to evolve as necessary. In the end 
though, I want the corMVC framework to be an aide and not a constraint-
affording the programmer the freedom to pile their own jQuery magic on top of 
this foundation.


[1]: http://www.bennadel.com
[2]: https://plus.google.com/108976367067760160494?rel=author
[3]: http://www.bennadel.com/blog/1730-Building-Single-Page-Applications-Using-jQuery-And-ColdFusion-With-Ben-Nadel-Video-Presentation-.htm

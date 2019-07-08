#!/usr/bin/perl
require 'globalvariables.pl';
require 'logfile_helper.pl';

##############################
# Get STDIN:
read(STDIN, $stdin, $ENV{'CONTENT_LENGTH'});
#$stdin = <STDIN>;

# Remove ^M from stdin:
#$stdin =~ s/'\t'/''/g;
$stdin =~ tr/\t//d;
$stdin =~ tr/\r//d;



##############################
# Write to logfile:
open(FP,">>$LM_HOME/Annotations/art_description.txt");
print FP "\n$stdin";
close(FP);

print "Content-type: text/xml\n\n" ;
print "<nop/>\n";

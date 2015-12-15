#!/bin/bash

for i in {1000..1099}
do
   l=`gshuf -n 1 items.json`
   l1=`echo $l | cut -c-8`
   l2=1111111111111$i
   l3=`echo $l | cut -c26-`
   echo $l1$l2$l3
done

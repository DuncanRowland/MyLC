#!/bin/bash

#mongoexport --host=127.0.0.1 --port=3001 --db=meteor --collection=items --out items.json

c=0
for i in {1000..1099}
do
   c=$((c+1))
   l=`head -$c items.json | tail -1`
   l1=`echo $l | cut -c-8`
   l2=`echo $i | cut -c2-`
   l3=`echo $l | cut -c26-`
   echo $l1$l2$l3
done

#mongoimport --host=127.0.0.1 --port=3001 --db=meteor --collection=items --drop --file items.json

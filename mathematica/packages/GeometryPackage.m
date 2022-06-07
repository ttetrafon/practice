(* ::Package:: *)

(* ::Input::Initialization:: *)
BeginPackage["GeometryPackage`"];
Unprotect@@Names["GeometryPackage``"];
ClearAll@@Names["GeometryPackage``"];


LengthOfLineSegment::usage="LengthOfLineSegment[{{x1,y1},{x2,y2}}]";
PointOfDivisionM::usage="PointOfDivision[{{x1,y1},{x2,y2}},r]";


Begin["`Private`"];


LengthOfLineSegment[{{x1_,y1_},{x2_,y2_}}]:=Module[{},
Sqrt[(x1-x2)^2+(y1-y2)^2]
];


PointOfDivisionM[{{x1_,y1_},{x2_,y2_}},r_]:=Module[
{x,y,r1,r2,d},
d=LengthOfLineSegment[{{x1,y1},{x2,y2}}];
r2=d/(1+r);
r1=r r2;
{(x1 r2+x2 r1)/d,(y1 r2+y2 r1)/d}
];


End[];


(* ::Input::Initialization:: *)
Protect@@Names["GeometryPackage``"];
EndPackage[];

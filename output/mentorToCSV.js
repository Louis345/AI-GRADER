/**
 * Simple converter that outputs data in TSV format ready for Excel copy-paste
 */

// Paste your CSV data between the backticks below
const csvData = `User Name,Team,Invitee Name,Invitee First Name,Invitee Last Name,Invitee Email,Invitee Time Zone,Invitee accepted marketing emails,Text Reminder Number,Event Type Name,Start Date & Time,End Date & Time,Location,Event Created Date & Time,Canceled,Canceled By,Cancellation reason,Question 1,Response 1,UTM Campaign,UTM Source,UTM Medium,UTM Term,UTM Content,Salesforce UUID,Event Price,Payment Currency,Guest Email(s),Invitee Reconfirmed,Marked as No-Show,Meeting Notes,Group,User Email,Event UUID,Invitee UUID,Invitee scheduled by,Scheduling method
Jamal Taylor,,David Joseph Albuquerque Canarsky,David,Joseph Albuquerque Canarsky,davidjosephgpa@gmail.com,Central Time - US & Canada,,,30 Minute Meeting,2025-03-03 11:00 am,2025-03-03 11:30 am,,2025-03-02 01:40 am,false,,,Please share anything that will help prepare for our meeting.,"This is for week 2, I want to learn how to put a confetti GIF on the CSS/HTML. Not sure if it's possible but want to learn. There are some other parts of the CSS that I want help to learn how to make changes with too.",,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,03d59076-596d-4012-b28c-cfd12c7e5082,a50d2793-6ba4-4ce0-8b2a-61402c4726bc,,
Jamal Taylor,,Marquel M Reece,Marquel,M Reece,marquelreece@gmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-10 05:00 pm,2025-03-10 05:30 pm,,2025-03-02 04:43 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,82083ec6-7579-47ae-a7d2-9801b304aabf,91de1c36-f38b-4e70-9a51-b9d1ed1c608a,,
Jamal Taylor,,Habib Steen,Habib,Steen,habibsteen@gmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-11 07:30 pm,2025-03-11 08:00 pm,,2025-03-02 09:57 pm,false,,,Please share anything that will help prepare for our meeting.,end of program planning,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,86df7586-61bc-436d-b743-3dd98783c53a,a5e1bdcb-6a23-4554-a1cf-04b01400387e,,
Jamal Taylor,,Colton Brighton,Colton,Brighton,coltonbrighton@gmail.com,Mountain Time - US & Canada,,,30 Minute Meeting,2025-03-04 05:30 pm,2025-03-04 06:00 pm,,2025-03-03 04:49 pm,false,,,Please share anything that will help prepare for our meeting.,"Hello, I am needing some help with my week 15 project specifically with adding a task which is triggered by a button in a components subcomponent but I would like the function to output in a card that is inside a completely different component.",,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,29bd8b30-eb6c-4f76-84d7-44c5f9acd9be,ef22b75a-64bd-42e9-a191-97bd31820981,,
Jamal Taylor,,Kyle,Kyle,,wattles.kyle66@gmail.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-08 12:00 pm,2025-03-08 12:30 pm,,2025-03-03 05:02 pm,false,,,Please share anything that will help prepare for our meeting.,I havent started yet i went camping and havent beena ble to start my assignment yet ,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,a5e5a944-a4bd-4b3c-854a-dc1b501361e9,63d6bf8f-fe89-4424-a35f-383f6341819e,,
Jamal Taylor,,Amy mcvade,Amy,mcvade,hainsamy@gmail.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-11 06:00 pm,2025-03-11 06:30 pm,,2025-03-03 05:30 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,69c099bd-5d01-4021-ac4d-cbc9f9c2a384,aac44480-dae7-4e1f-8f88-df6a532dc895,,
Jamal Taylor,,Sondra Fields,Sondra,Fields,sfields_10@comcast.net,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-08 11:00 am,2025-03-08 11:30 am,,2025-03-03 07:46 pm,false,,,Please share anything that will help prepare for our meeting.,Review assigments,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,7dcbe364-d3ad-4d24-bc62-c186283ae23b,478ac6f5-158e-4555-8717-70fcfd25fa83,,
Jamal Taylor,,Hawa Husseini,Hawa,Husseini,siahusseini143@gmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-11 05:00 pm,2025-03-11 05:30 pm,,2025-03-04 09:42 am,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,01861dc1-e884-46b8-b21d-6c26964e9e21,cff2bf11-f970-4d8e-b988-89db36ac3b72,,
Jamal Taylor,,Marita Lawson,Marita,Lawson,mar2370207@maricopa.edu,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-13 05:00 pm,2025-03-13 05:30 pm,,2025-03-04 03:53 pm,false,,,Please share anything that will help prepare for our meeting.,1:1 30 minute week 2 questions (front end),,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,fc42c058-2eef-44d4-866c-e52d1002b127,0c903b31-4762-4f98-98f1-5416ecd7ff76,,
Jamal Taylor,,Jorge Mares,Jorge,Mares,jjmares912@gmail.com,Central Time - US & Canada,,,30 Minute Meeting,2025-03-12 06:00 pm,2025-03-12 06:30 pm,,2025-03-04 06:38 pm,false,,,Please share anything that will help prepare for our meeting.,"Grading. Certification status questions. I believe I enrolled in a Back-end class too, but I'm unsure.",,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,a9d71d34-0e1a-4209-972a-24db6da2640a,50a857bf-fd8d-4f54-9997-a84c1ab499ee,,
Jamal Taylor,,Marita Lawson,Marita,Lawson,marita.lawson@gmail.com,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-19 07:00 pm,2025-03-19 07:30 pm,Zoom URL: https://Quickstart.zoom.us/j/92494367104,2025-03-04 07:00 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,85470b5d-28ca-41c5-b491-9180116d5f41,6962a716-2e5b-4a8c-84c4-b4e1f6e5e176,,
Jamal Taylor,,sunil,sunil,,mail2sunny120@gmail.com,India Standard Time,,,30 Minute Meeting,2025-03-15 11:00 am,2025-03-15 11:30 am,Zoom URL: https://Quickstart.zoom.us/j/92366244747,2025-03-04 08:58 pm,false,,,Please share anything that will help prepare for our meeting.,I am trying to develop an ecommerce store on the side .....facing issues with that.....with Paypal Payment Processing......Thanks,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,470095de-a8f2-4a92-98fe-f206b026b984,7bfa8891-5c1b-4b5b-aecc-47794e335dc8,,
Jamal Taylor,,Jose Antonio Morales,Jose,Antonio Morales,idesignstuff99@gmail.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-12 07:00 pm,2025-03-12 07:30 pm,Zoom URL: https://Quickstart.zoom.us/j/93661422620,2025-03-05 12:11 am,false,,,Please share anything that will help prepare for our meeting.,I'm getting errors when i run npm install Mocha and Chai older versions.,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,bde52d22-8c6f-4e15-9038-b1d14a00e5a3,8895dfa2-0c64-483a-8daf-6e4a982d284d,,
Jamal Taylor,,Julie Alexander,Julie,Alexander,juliealexander@alexanconsulting.co,Mountain Time - US & Canada,,,30 Minute Meeting,2025-03-13 06:00 pm,2025-03-13 06:30 pm,Zoom URL: https://Quickstart.zoom.us/j/97288447182,2025-03-05 08:10 am,false,,,Please share anything that will help prepare for our meeting.,"If I haven't figured it out yet, I'd like to go over pushing and committing my files to github and some of the function exercises. ",,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,70ee7a99-71e4-43d1-b4d2-aec3c520c8af,d60961ef-faf3-4cc3-a8a4-5ac1c5534acb,,
Jamal Taylor,,kyle,kyle,,wattles.kyle66@gmail.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-13 07:00 pm,2025-03-13 07:30 pm,Zoom URL: https://Quickstart.zoom.us/j/97155012159,2025-03-05 12:37 pm,false,,,Please share anything that will help prepare for our meeting.,idk im scheduling this in advance,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,a8b29dc9-1b6f-4d09-a0a4-7fd349cfb3e0,cd35d738-2e64-494e-83ea-eb6e4f45b05a,,
Jamal Taylor,,ViRo Blossoms,ViRo,Blossoms,viroblossoms@gmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-14 07:00 pm,2025-03-14 07:30 pm,Zoom URL: https://Quickstart.zoom.us/j/96659700136,2025-03-05 05:38 pm,false,,,Please share anything that will help prepare for our meeting.,Front End Certificate Details ,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,4ee4c371-5926-4a20-9baf-ec0c4bff2820,f91dd4e0-de77-41d1-8754-4edb0c756181,,
Jamal Taylor,,Hawa Husseini,Hawa,Husseini,siahusseini143@gmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-17 07:30 pm,2025-03-17 08:00 pm,Zoom URL: https://Quickstart.zoom.us/j/94833614589,2025-03-05 08:35 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,f8c6a4eb-b17a-45dc-a720-88f7a2197693,e8737f55-22cd-4a8b-9537-b1efb5847469,,
Jamal Taylor,,Heather j Haymond,Heather,j Haymond,edtechenthusiast101@gmail.com,Central Time - US & Canada,,,30 Minute Meeting,2025-03-17 05:00 pm,2025-03-17 05:30 pm,Zoom URL: https://Quickstart.zoom.us/j/96247380221,2025-03-06 06:47 pm,false,,,Please share anything that will help prepare for our meeting.,Job seeking advice and strategy ,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,0f4b8304-d889-4950-9fdb-c2e7e0abc685,3ed1c18a-d6cb-4649-bd93-12f168b01123,,
Jamal Taylor,,Chelsea Mcphetridge,Chelsea,Mcphetridge,janeb4763@gmail.com,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-07 06:00 pm,2025-03-07 06:30 pm,Zoom URL: https://Quickstart.zoom.us/j/96092227894,2025-03-07 11:21 am,false,,,Please share anything that will help prepare for our meeting.,Gelpbwith Gut and Git gub,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,0b793830-413d-468a-98c4-79c41de46109,3014f7af-9937-4589-921f-988229226536,,
Jamal Taylor,,Michael Quint,Michael,Quint,michaelquint@gmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-18 05:00 pm,2025-03-18 05:30 pm,Zoom URL: https://Quickstart.zoom.us/j/97988019542,2025-03-07 04:32 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,3901e97a-6f3f-4826-9dd9-2ac125b9bfb9,8ba7f977-394e-42b8-9e27-2d959fb9bf87,,
Jamal Taylor,,Steven Joseph Cabrera,Steven,Joseph Cabrera,scabrera28@gmail.com,Mountain Time - US & Canada,,,30 Minute Meeting,2025-03-22 11:30 am,2025-03-22 12:00 pm,Zoom URL: https://Quickstart.zoom.us/j/91554371090,2025-03-07 06:04 pm,false,,,Please share anything that will help prepare for our meeting.,I want to know if I have any missing assignments or if i am accessing the appropriate websites. I saw someone else in the Slack channel using a promineotech.openclass.ai domain and I do not know what that is. please help me get access to everything i need to learn and pass the course.,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,3dd83da3-0a30-491d-8ca7-af9e15db5d02,c7a8411a-a29e-4525-8953-94cbfe9beb00,,
Jamal Taylor,,Mina Dimyan,Mina,Dimyan,minadimyan21@gmail.com,Central European Time,,,30 Minute Meeting,2025-03-18 06:30 pm,2025-03-18 07:00 pm,Zoom URL: https://Quickstart.zoom.us/j/94582860613,2025-03-08 11:00 am,false,,,Please share anything that will help prepare for our meeting.,more questions about making app with react,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,779aa5b7-1c2e-4021-b6c8-a457946a9f51,cac2be4d-3509-41f8-9524-ffbb3d9e7743,,
Jamal Taylor,,kyle,kyle,,wattles.kyle66@gmail.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-09 12:00 pm,2025-03-09 12:30 pm,Zoom URL: https://Quickstart.zoom.us/j/97348542800,2025-03-08 03:36 pm,false,,,Please share anything that will help prepare for our meeting.,trying to get my buttons to work,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,735224a8-18d1-426b-a689-a19f437a8b74,08d57d11-c2ae-44de-a3ca-83d14cfb3506,,
Jamal Taylor,,Batool Hashim,Batool,Hashim,batoolhashim01@gmail.com,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-19 05:00 pm,2025-03-19 05:30 pm,Zoom URL: https://Quickstart.zoom.us/j/93260046649,2025-03-08 11:30 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,120fd5a2-094d-4f00-8b5b-1f9f3c07f0ea,e961eac0-99a1-4012-b971-96352cad2e23,,
Jamal Taylor,,Melyssa Rodman,Melyssa,Rodman,melyssaspaulding@gmail.com,Mountain Time - US & Canada,,,30 Minute Meeting,2025-03-20 07:00 pm,2025-03-20 07:30 pm,Zoom URL: https://Quickstart.zoom.us/j/98649059709,2025-03-09 01:40 pm,false,,,Please share anything that will help prepare for our meeting.,I have made a new account on my laptop and set it to admin and am now redownloading everything. I just need help with setting up git and doing a git pull of all of my code as well as trying again with getting bootstrap to work. ,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,db251ded-c538-4990-ab72-c6cfaf46cfe9,26972aca-746d-413a-a1b8-39ded38702fb,,
Jamal Taylor,,Chelsea mcphetridge,Chelsea,mcphetridge,janeb4763@gmail.com,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-16 12:00 pm,2025-03-16 12:30 pm,Zoom URL: https://Quickstart.zoom.us/j/98347994266,2025-03-09 10:41 pm,false,,,Please share anything that will help prepare for our meeting.,Checking ro see if everything is correct,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,9be78e58-536b-43c1-bc41-8904775fc572,89c166d9-1442-4eb2-a768-aa305fdeeb42,,
Jamal Taylor,,Marquel M Reece,Marquel,M Reece,marquelreece@gmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-19 06:00 pm,2025-03-19 06:30 pm,Zoom URL: https://Quickstart.zoom.us/j/97297087783,2025-03-11 04:34 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,63ea1388-3b98-4fa8-a8a4-fc4de6ad2e32,6121b569-ef4e-48f4-88d0-5e112d55960d,,
Jamal Taylor,,Amy mcvade,Amy,mcvade,hainsamy@gmail.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-16 11:00 am,2025-03-16 11:30 am,Zoom URL: https://Quickstart.zoom.us/j/92420148277,2025-03-11 06:35 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,9008bc5f-04b3-46b1-a014-1803037d2591,967dccc6-43f3-4a50-8450-83eff86c7ca7,,
Jamal Taylor,,Sondra M Fields,Sondra,M Fields,sfields_10@comcast.net,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-20 06:00 pm,2025-03-20 06:30 pm,Zoom URL: https://Quickstart.zoom.us/j/95814910581,2025-03-11 11:11 pm,false,,,Please share anything that will help prepare for our meeting.,Help with study.,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,36c3e085-13bb-4634-b95d-c52997d36cc1,71c7583b-e3cb-4851-ad1c-95acb3c7ff96,,
Jamal Taylor,,Marie Ruth Paul,Marie,Ruth Paul,rutchie2008@hotmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-20 05:00 pm,2025-03-20 05:30 pm,Zoom URL: https://Quickstart.zoom.us/j/95159263335,2025-03-12 10:45 am,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,d4674b3a-7637-4b48-8d4c-448470829f2a,a56f270d-919b-4757-a68c-34ab914beac3,,
Jamal Taylor,,Marie Ruth Paul,Marie,Ruth Paul,rutchie2008@hotmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-21 07:30 pm,2025-03-21 08:00 pm,Zoom URL: https://Quickstart.zoom.us/j/97679180934,2025-03-12 10:48 am,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,cee05e5e-0128-4d36-b9b9-5ed2c0519cce,9a99243f-5161-46d1-a3df-199392854a9b,,
Jamal Taylor,,Trevor Dockum,Trevor,Dockum,trevordock3@gmail.com,Central Time - US & Canada,,,30 Minute Meeting,2025-03-21 05:00 pm,2025-03-21 05:30 pm,Zoom URL: https://Quickstart.zoom.us/j/93735393957,2025-03-13 04:00 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,5509bd12-3da8-45aa-ba5f-8ba477987fc6,a072b2d5-1af8-458b-a372-7702120c5dac,Trevor Dockum,
Jamal Taylor,,Marie Ruth Paul,Marie,Ruth Paul,rutchie2008@hotmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-21 06:30 pm,2025-03-21 07:00 pm,Zoom URL: https://Quickstart.zoom.us/j/95559141586,2025-03-13 07:16 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,8c62b6dc-efdb-4ce1-82e8-a1a46e683637,ae23e785-8ad6-4218-bdff-1334ffbaea42,,
Jamal Taylor,,Michael Belleres,Michael,Belleres,mbelleres@hotmail.com,Mountain Time - US & Canada,,,30 Minute Meeting,2025-03-24 05:30 pm,2025-03-24 06:00 pm,Zoom URL: https://Quickstart.zoom.us/j/94935723505,2025-03-13 08:04 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,f720d81e-90de-4b76-9808-4cd69a034d35,14c997fe-aa00-4349-9aba-5129299484da,,
Jamal Taylor,,stan douglas,stan,douglas,standouglas14@gmail.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-16 03:00 pm,2025-03-16 03:30 pm,Zoom URL: https://Quickstart.zoom.us/j/93098177199,2025-03-13 10:09 pm,false,,,Please share anything that will help prepare for our meeting.,"I got stuck on my FE week 12 project and it's to the point where I can't continue onto my week 13 project because it doesn't work. 

here's the github link : https://github.com/huskyman11/Week12Projectv2.git",,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,0a2a16d8-3456-49f6-8ec7-ee15ae54aec7,1da13f0c-c6f6-47ab-b42d-f5acfe2c7c56,,
Jamal Taylor,,Jessica Landeros,Jessica,Landeros,jessicatlanderos@gmail.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-14 06:00 pm,2025-03-14 06:30 pm,Zoom URL: https://Quickstart.zoom.us/j/94711866718,2025-03-13 11:50 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,63b42e24-2dfe-45d0-a159-30ea337c5e76,47226baf-e7f3-475f-9540-fb299fa7a2db,,
Jamal Taylor,,Sondra M Fields,Sondra,M Fields,sfields_10@comcast.net,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-15 03:30 pm,2025-03-15 04:00 pm,Zoom URL: https://Quickstart.zoom.us/j/93764704180,2025-03-14 12:37 am,false,,,Please share anything that will help prepare for our meeting.,"Help reviewing my progress and trouble spots, like loops",,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,ba443ef8-a644-49e8-a25e-3bced1788753,dab0286e-2f32-4cc8-8ca4-9e28958eb9f7,,
Jamal Taylor,,Marita Lawson,Marita,Lawson,mar2370207@maricopa.edu,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-28 04:30 pm,2025-03-28 05:00 pm,Zoom URL: https://Quickstart.zoom.us/j/92265041602,2025-03-14 03:34 am,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,9c5baba1-a6dc-48dc-ac58-ff698f9e67ff,9139489f-0611-49ed-92d9-ee41cdac9472,,
Jamal Taylor,,Hawa,Hawa,,siahusseini143@gmail.com,Eastern Time - US & Canada,,,One-off meeting,2025-03-14 04:30 pm,2025-03-14 05:00 pm,,2025-03-14 05:25 am,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,9cd80a06-ecae-49ed-baa5-b77e987ab32e,df294753-fc41-4317-a975-0b700882a0ff,,
Jamal Taylor,,Ruby Sanchez,Ruby,Sanchez,rubygalaxy439@gmail.com,Mountain Time - US & Canada,,,30 Minute Meeting,2025-03-16 01:30 pm,2025-03-16 02:00 pm,Zoom URL: https://Quickstart.zoom.us/j/93094222135,2025-03-14 02:19 pm,false,,,Please share anything that will help prepare for our meeting.,"Hi, I started this class a little late and I fear I'm already falling behind and haven't figured out where to find all the information for assignments and other small technical problems. I would appreciate some more guidance.",,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,b6fbc258-489a-40ca-9771-3c15c0b5d830,81918a29-8ebb-4794-8a63-3f8aae89eccb,,
Jamal Taylor,,Marie Ruth Paul,Marie,Ruth Paul,rutchie2008@hotmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-15 02:30 pm,2025-03-15 03:00 pm,Zoom URL: https://Quickstart.zoom.us/j/92513055902,2025-03-14 06:40 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,b1d89cea-a7e9-4219-80ca-6fc1208e1235,b2b97601-0f60-40db-ac4e-40c8cde0f668,,
Jamal Taylor,,Katrina Taylor,Katrina,Taylor,whitedove-14@hotmail.com,Mountain Time - US & Canada,,,30 Minute Meeting,2025-03-22 03:30 pm,2025-03-22 04:00 pm,Zoom URL: https://Quickstart.zoom.us/j/99841151461,2025-03-15 02:07 pm,false,,,Please share anything that will help prepare for our meeting.,week 17 project - various errors and such,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,ad12f663-68ce-484d-aedc-6127d68ada30,5072ce53-5325-4ebd-a142-838de075db03,,
Jamal Taylor,,Caitlyn Trower,Caitlyn,Trower,cait.trower@gmail.com,Central Time - US & Canada,,,30 Minute Meeting,2025-03-22 02:00 pm,2025-03-22 02:30 pm,Zoom URL: https://Quickstart.zoom.us/j/99505199600,2025-03-15 04:26 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,cb857f66-5f75-44ff-a2c7-f3967da546d8,ed83acb2-6aad-4045-891b-85d7474a1a56,,
Jamal Taylor,,Erin Bennett,Erin,Bennett,bennetterin2003@gmail.com,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-24 07:30 pm,2025-03-24 08:00 pm,Zoom URL: https://Quickstart.zoom.us/j/94017950376,2025-03-16 01:27 am,false,,,Please share anything that will help prepare for our meeting.,I am having trouble understanding how to invoke or call code. I can figure out how to do it but I think I just need help like understanding it better,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,b02a8d89-0022-4ce2-8ddb-846c9d80ceba,2450785b-740a-4721-aca3-96bbc2233680,,
Jamal Taylor,,Jacob R,Jacob,R,kennethelrey27@gmail.com,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-25 06:30 pm,2025-03-25 07:00 pm,Zoom URL: https://Quickstart.zoom.us/j/99956037488,2025-03-17 05:48 pm,false,,,Please share anything that will help prepare for our meeting.,Github help,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,fb366919-ef36-45fc-aeaf-b32ddb3c1ef6,8ff4777a-20b3-437e-baee-9060793e0bb3,,
Jamal Taylor,,Colton Brighton,Colton,Brighton,coltonbrighton@gmail.com,Mountain Time - US & Canada,,,30 Minute Meeting,2025-03-25 05:00 pm,2025-03-25 05:30 pm,Zoom URL: https://Quickstart.zoom.us/j/97633841888,2025-03-17 06:14 pm,false,,,Please share anything that will help prepare for our meeting.,I would like to discuss how to implement the week 17 coding assignment. I have a general layout for the application that I want to build out for it. The problem that I am encountering is with the users. I don't really know how I can implement certain tasks only displaying if that user is logged in and how to handle requests like logging in password recovery etc...,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,bb0258a4-974a-44d5-b388-7cf909f31355,e36ad6dd-1234-4a8a-b34c-6655b6d8b595,,
Jamal Taylor,,Marc Dolph,Marc,Dolph,marc11dolph@gmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-23 12:00 pm,2025-03-23 12:30 pm,Zoom URL: https://Quickstart.zoom.us/j/93861883167,2025-03-17 07:44 pm,false,,,Please share anything that will help prepare for our meeting.,Menu App Help,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,1164355c-36e0-4ba8-ad61-e84867cc0878,97dace3b-c8dc-418e-bf75-b2420162c7b4,,
Jamal Taylor,,Marquel Reece ,Marquel,Reece ,marquelreece@gmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-26 05:00 pm,2025-03-26 05:30 pm,Zoom URL: https://Quickstart.zoom.us/j/96090907952,2025-03-19 08:59 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,965cfd40-49bb-4e01-b861-24767547e5b8,a6081b40-2b91-4115-bcfc-1aea62fa0589,,
Jamal Taylor,,Alex Minnick,Alex,Minnick,alexrminnick@gmail.com,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-23 01:30 pm,2025-03-23 02:00 pm,Zoom URL: https://Quickstart.zoom.us/j/95236970192,2025-03-19 10:03 pm,false,,,Please share anything that will help prepare for our meeting.,"Looking for general input, constructive criticism, and thoughts on design patterns  for my vanillaJS scheduling app project.",,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,401d8ba7-9331-42f0-a540-e7205965cceb,e57569ec-4a48-4209-a962-021d1b63e3c3,,
Jamal Taylor,,Michele Sequeira,Michele,Sequeira,msequeira@salud.unm.edu,Mountain Time - US & Canada,,,30 Minute Meeting,2025-03-26 06:00 pm,2025-03-26 06:30 pm,Zoom URL: https://Quickstart.zoom.us/j/91209163219,2025-03-20 04:40 pm,false,,,Please share anything that will help prepare for our meeting.,Feedback on my coursework so far; get your take on how to position myself in the industry and job market.,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,7de349da-d8e5-4225-8a96-869b0fbb17de,b71947c4-3631-4c39-9d3c-23b8e0f6be40,,
Jamal Taylor,,kyle,kyle,,wattles.kyle66@gmail.com,Pacific Time - US & Canada,,,One-off meeting,2025-03-21 06:30 pm,2025-03-21 07:00 pm,,2025-03-20 08:23 pm,false,,,Please share anything that will help prepare for our meeting.,what components should i use for what im trying to do? how should they be laid out and implemented? and if possible id like to try to practice getting more comfortable with understanding the syntax and reading documentation,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,dcac867a-5fbf-4d80-b447-825098127d22,a2f15972-5781-4cce-bc9d-7906fdf09a33,,
Jamal Taylor,,elena cuevas,elena,cuevas,cuevas.elena97@gmail.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-26 07:00 pm,2025-03-26 07:30 pm,Zoom URL: https://Quickstart.zoom.us/j/93543698233,2025-03-21 01:28 am,false,,,Please share anything that will help prepare for our meeting.,catching up ,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,4d9f8cd0-e956-45e8-89f4-3b891afd6d8d,63a71cf5-3aa4-4520-8d15-f2e9ef9e7f83,,
Jamal Taylor,,Marie Ruth Paul,Marie,Ruth Paul,rutchie2008@hotmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-28 07:30 pm,2025-03-28 08:00 pm,Zoom URL: https://Quickstart.zoom.us/j/91577244362,2025-03-22 01:03 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,53d1e056-494d-487e-bd83-7e27b9629cf3,be52acd1-b231-431e-8c8b-2b64a187a6f8,,
Jamal Taylor,,Sondra M Fields,Sondra,M Fields,sfields_10@comcast.net,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-29 11:00 am,2025-03-29 11:30 am,Zoom URL: https://Quickstart.zoom.us/j/92102882411,2025-03-22 02:47 pm,false,,,Please share anything that will help prepare for our meeting.,"Reviewing assignment to make sure it is correct, and loaded properly",,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,a8e3800d-4852-4527-b32d-77a1bbc9b0d2,3edbe8bd-8c99-41e1-9346-36d71361a88d,,
Jamal Taylor,,Brandon J. Hinrichs,Brandon,J. Hinrichs,bhinrichs1380@gmail.com,Central Time - US & Canada,,,30 Minute Meeting,2025-03-27 07:30 pm,2025-03-27 08:00 pm,Zoom URL: https://Quickstart.zoom.us/j/97703142596,2025-03-22 02:50 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,b0eb02ae-b4dc-410d-847f-380d978dca6a,4819811e-ae83-439e-94d2-1cb74db67933,,
Jamal Taylor,,Jakob Bertram,Jakob,Bertram,bertramjakob0@gmail.com,Central Time - US & Canada,,,30 Minute Meeting,2025-03-23 03:30 pm,2025-03-23 04:00 pm,Zoom URL: https://Quickstart.zoom.us/j/92415300606,2025-03-23 11:02 am,false,,,Please share anything that will help prepare for our meeting.,Problems with learning how to use Mocha and Chai with javasrcript specifically.,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,9bbf6b88-ee2b-4833-b1a6-9d4876e8df61,b8c82157-c653-4472-957f-20afda15f640,Jamal Taylor,
Jamal Taylor,,Marc Dolph,Marc,Dolph,marc11dolph@gmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-27 05:00 pm,2025-03-27 05:30 pm,Zoom URL: https://Quickstart.zoom.us/j/92503547902,2025-03-23 12:45 pm,false,,,Please share anything that will help prepare for our meeting.,Help going over all my caught up homework!,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,4b6c5189-2397-4b6a-a38c-419c14ce06a1,8320685d-1537-4c45-87f4-792c58061639,,
Jamal Taylor,,Anthony Robles,Anthony,Robles,anthonyrobles1995@gmail.com,"Arizona, Yukon Time",,,30 Minute Meeting,2025-03-29 02:00 pm,2025-03-29 02:30 pm,Zoom URL: https://Quickstart.zoom.us/j/99533030202,2025-03-23 01:03 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,ea34195e-aab2-4681-a3c6-4eefd8fa6163,ca651c16-d395-4ef2-8681-3a1cdde155ab,,
Jamal Taylor,,Mina Dimyan,Mina,Dimyan,minadimyan21@gmail.com,Central European Time,,,30 Minute Meeting,2025-03-27 06:00 pm,2025-03-27 06:30 pm,Zoom URL: https://Quickstart.zoom.us/j/96190632841,2025-03-24 05:40 pm,false,,,Please share anything that will help prepare for our meeting.,I have some questions ,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,fcb77f68-c282-4a64-95d4-a1786616eb39,d1ccd7a5-1384-444e-993b-fe4d30335784,,
Jamal Taylor,,Jose Antonio Morales,Jose,Antonio Morales,idesignstuff99@gmail.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-29 03:00 pm,2025-03-29 03:30 pm,Zoom URL: https://Quickstart.zoom.us/j/99669927295,2025-03-24 08:32 pm,false,,,Please share anything that will help prepare for our meeting.,I need with week 12 coding project. Working with API,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,0dc60c7d-b4ed-4358-99b7-97a7f5786e3b,e8d030cf-50e7-458a-a373-ffc6566b84a1,,
Jamal Taylor,,Marc Dolph,Marc,Dolph,marc11dolph@gmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-31 06:30 pm,2025-03-31 07:00 pm,Zoom URL: https://Quickstart.zoom.us/j/91353201548,2025-03-25 04:36 pm,false,,,Please share anything that will help prepare for our meeting.,"Going over my War Game. my shuffle deck function isn't working, and I've tried to fix what Ive talked to AI about. And no I did not copy and paste what it said but instead used what it was saying to edit my own code I wrote. And its still not working so I had it summarize everything we talked about into bullet points for us to to talk about ",,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,c229f16b-f06a-4631-b54a-e27d431ed4e4,07aedd9c-3932-4fe7-8e33-51d166698dfe,,
Jamal Taylor,,Lori Mills,Lori,Mills,loralie2014@yahoo.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-29 12:30 pm,2025-03-29 01:00 pm,Zoom URL: https://Quickstart.zoom.us/j/92287319919,2025-03-26 04:11 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,b76d35dd-7249-4cd9-b91b-49798910ca2e,c3329e5d-ebc9-4267-9cb7-dff3946740f3,Lori Mills,
Jamal Taylor,,Jakob Bertram,Jakob,Bertram,bertramjakob0@gmail.com,Central Time - US & Canada,,,30 Minute Meeting,2025-03-31 05:00 pm,2025-03-31 05:30 pm,Zoom URL: https://Quickstart.zoom.us/j/95932808553,2025-03-27 08:11 pm,false,,,Please share anything that will help prepare for our meeting.,Trouble implementing mocha and chai into javascript week 9 project.,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,adcdbad7-b3f4-4b63-a3e4-e0bf43eb4389,c136fc7e-6589-4441-af1c-8f867b715788,,
Jamal Taylor,,Gabriel,Gabriel,,perez.gabriel6389@gmail.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-28 05:30 pm,2025-03-28 06:00 pm,Zoom URL: https://Quickstart.zoom.us/j/95337628752,2025-03-27 10:16 pm,false,,,Please share anything that will help prepare for our meeting.,Getting to know each other ,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,0d87c708-ee07-4932-9aa9-031a0d4d282a,d469abc5-6ab3-4393-b9e0-c689e168c597,,
Jamal Taylor,,Rosario Corsini,Rosario,Corsini,corsinirosario@gmail.com,Eastern Time - US & Canada,,,30 Minute Meeting,2025-03-30 11:00 am,2025-03-30 11:30 am,Zoom URL: https://Quickstart.zoom.us/j/96437860556,2025-03-28 10:05 am,false,,,Please share anything that will help prepare for our meeting.,I have a query(s) for Week 1: HTML,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,ca9e7aa8-ce8b-4ff1-9f22-78e2451c36a1,2b134eb0-dc4b-46d7-80e7-3de6c0672703,,
Jamal Taylor,,Gabriel Perez,Gabriel,Perez,perez.gabriel6389@gmail.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-30 03:00 pm,2025-03-30 03:30 pm,Zoom URL: https://Quickstart.zoom.us/j/93696807687,2025-03-29 01:54 am,false,,,Please share anything that will help prepare for our meeting.,I have a query(s) for Week 0: Orientation week (frontend) Issues with VS Code install.,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,7418f2ce-df5d-46b2-bd2e-82b9728c0aa7,62b5bca4-1988-4f2d-a812-bc0edd1a7fd3,,
Jamal Taylor,,lori mills,lori,mills,loralie2014@yahoo.com,Pacific Time - US & Canada,,,30 Minute Meeting,2025-03-31 06:00 pm,2025-03-31 06:30 pm,Zoom URL: https://Quickstart.zoom.us/j/95451260003,2025-03-29 02:09 pm,false,,,,,,,,,,,,,,,No,,Instructors,jamal.taylor@quickstart.com,ccabd415-bc67-432c-8329-cf58b61c266b,024ce029-e2d9-442c-8cac-926b1d5f9e5b,Lori Mills,
.`; // Your CSV data here

// Parse and convert to Excel-friendly format
function convertCsvToExcelFormat(csvData) {
  // Parse CSV data
  const lines = csvData.split("\n");
  const headers = lines[0].split(",");

  // Map CSV headers to indices
  const headerMap = {};
  headers.forEach((header, index) => {
    headerMap[header.trim()] = index;
  });

  // Define output columns
  const outputColumns = [
    "#",
    "Student Name",
    "Email Address",
    "Session Name",
    "Remarks",
    "Date",
    "Time Zone",
  ];

  // Create header row for output
  let output = outputColumns.join("\t") + "\n";

  // Process data rows
  for (let i = 1; i < lines.length; i++) {
    // Skip empty lines
    if (!lines[i].trim()) continue;

    // Parse the CSV line
    const row = parseCSVLine(lines[i]);

    // Create an object for the row
    const rowData = {
      "#": i,
      "Student Name": `${row[headerMap["Invitee First Name"]] || ""} ${
        row[headerMap["Invitee Last Name"]] || ""
      }`.trim(),
      "Email Address": row[headerMap["Invitee Email"]] || "",
      "Session Name": row[headerMap["Event Type Name"]] || "",
      Remarks: row[headerMap["Response 1"]] || "",
      Date: formatDate(row[headerMap["Start Date & Time"]] || ""),
      "Time Zone": row[headerMap["Invitee Time Zone"]] || "",
    };

    // Add the row to output
    output += outputColumns.map((col) => rowData[col] || "").join("\t") + "\n";
  }

  return output;
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Add the last field
  result.push(current.trim());
  return result;
}

/**
 * Format date string
 */
function formatDate(dateString) {
  if (!dateString) return "";

  try {
    // Handle 2025-03-03 11:00 am format
    const parts = dateString.split(" ");
    if (parts.length < 2) return dateString;

    const datePart = parts[0];
    const timePart = `${parts[1]} ${parts[2] || ""}`;

    // Format as MM/DD/YYYY
    const [year, month, day] = datePart.split("-");
    return `${month}/${day}/${year} ${timePart}`;
  } catch (e) {
    return dateString;
  }
}

// ----------------------------------------
// GENERATE EXCEL-READY OUTPUT
// ----------------------------------------

// Generate the output text ready for copy-paste to Excel
const excelReadyText = convertCsvToExcelFormat(csvData);

// Display the output for copy-paste
console.log("=== COPY EVERYTHING BELOW THIS LINE FOR EXCEL PASTE ===");
console.log(excelReadyText);
console.log("=== END COPY CONTENT ===");

// If you're running this in a Node.js environment and want to save to file:
//
const fs = require("fs");
fs.writeFileSync("sessions.csv", excelReadyText);
console.log("File saved as sessions.csv");

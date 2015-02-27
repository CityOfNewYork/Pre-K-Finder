/*****************************************************************************************************************
 *																												 *
 * READ AND UNDERSTAND EVEYTHING IN THIS COMMENT BLOCK BEFORE EDITING THE 										 *
 * DATE VALUES IN THIS FILE.																					 *
 * 																												 *
 *****************************************************************************************************************
 * 																												 *
 * MAKE A COPY OF THIS FILE AS A BACKUP BEFORE EDITING IT.														 *
 * 																												 *
 * When you are ready to edit this file you should edit the one on the DOE staging server 						 *
 * (//schoolsstg.nycenet.edu/schoolsearch/date_rules.js) FIRST and then TEST and VALIDATE your changes by 		 *
 * accessing the "Pre-K Finder" application at https://cs-gis-stg-prx.csc.nycnet/upk BEFORE COPYING the edited	 *
 * date_rules.js file to the DOE production server (//www.nycenet.edu/schoolsearch/date_rules.js).				 *
 * 																												 *
 *****************************************************************************************************************
 *																												 *
 * THIS FILE MUST RESIDE IN THE SAME DIRECTORY AS THE "Get in Touch" FORM!										 *
 * 																												 *
 * YYYY-MM-DD is the ISO specified format for dates used by web browser.										 *
 * 																												 *
 * When altering date values in this file you must adhere to the YYYY-MM-DD specification and the date string 	 *
 * must be quoted.																								 *
 * 																												 *
 * If the dates below are changed they MUST remain in this format for the "Pre-K Finder" application and 		 *
 * "Get in Touch" form to accept them.																			 *
 * 																												 *
 * The ONLY EXCEPTIONS to the YYYY-MM-DD format are SCHOOL_YEAR and PRE_K_REQUIRED_DOB_YEAR which are free-form  *
 * text strings.  These variables must also be quoted but no format checking will be done - what you type for 	 *
 * those values WILL be displayed on the "Get in Touch" form regardless of format.								 *
 * 																												 *
 * 																												 *
 *****************************************************************************************************************
 *																												 *
 * THE VARIABLES ARE DESCRIBED BELOW																			 *
 * 																												 *
 *****************************************************************************************************************
 * 																												 *
 * TODAY                   - Today.  DO NOT CHANGE!																 *
 *                           This value MUST NOT be assigned to any other variable besides MAX_DOB.				 *
 *                                																				 *
 *                           DO NTO CHANGE!																		 *
 *                            																					 *
 * 																												 *
 * MIN_DOB                 - The minimum date of birth accepted by the "Get in Touch" form.						 *
 *      																										 *
 *                           MUST BE SET TO A PROPERLY FORMATTED AND QUOTED DATE STRING.						 *
 *                                																				 *
 * 																												 *
 * MAX_DOB                 - The maximum date of birth accepted by the "Get in Touch" form.						 *
 *      																										 *
 *                           MAY BE SET TO TODAY OR A PROPERLY FORMATTED AND QUOTED DATE STRING.				 *
 *                                																				 *
 *																												 *
 * DEFAULT_DOB_ENTRY       - If the user's browser supports the HTML5 date input type then this					 *
 *                           will be the default date shown in the popup calendar.  							 *
 *                                																				 *
 *                           MUST BE SET TO A PROPERLY FORMATTED AND QUOTED DATE STRING.						 *
 *                                																				 *
 *																												 *
 * PRE_K_REQUIRED_DOB_YEAR - This is the string value that will be displayed for birth year 					 *
 *                           eligibility in the note below the date of birth field on the 						 *
 *                           "Get in Touch" form. 																 *
 *                                																				 *
 *                           MUST BE SET TO A QUOTED STRING.													 *
 *                                																				 *
 *																												 *
 * APPLY_START_DATE        - The "Apply Now" buttons in the "Pre-K Finder" application will appear at			 *
 *                           the start of APPLY_START_DATE (i.e. APPLY_START_DATE = "2015-03-16";  				 *
 *                           means the "Apply Now" buttons will be displayed beginning at 						 *
 *                           2015-03-16 12:00 AM).																 *
 * 																												 *
 *                           MUST BE SET TO A PROPERLY FORMATTED AND QUOTED DATE STRING.						 *
 *                                																				 *
 *																												 *
 * APPLY_END_DATE	       - The "Apply Now" buttons in the "Pre-K Finder" application will no longer            *
 *                           appear at the start of APPLY_END_DATE (i.e. APPLY_END_DATE = "2015-04-25";          *
 *                           means the "Apply Now" buttons will no longer be displayed beginning at              *
 *                           2015-04-25 12:00 AM).                                                               *
 * 																												 *
 *                           MUST BE SET TO A PROPERLY FORMATTED AND QUOTED DATE STRING.						 *
 *                                																				 *
 * 																												 *
 * SCHOOL_YEAR             - This is the string value that will be displayed for school year on the				 *
 *                           "Pre-K Finder" application banner and in the note below the date of birth 			 *
 *                           field on the "Get in Touch" form.													 *
 *                                																				 *
 *                           MUST BE SET TO A QUOTED STRING.													 *
 *                                																				 *
 *****************************************************************************************************************
 *																												 *
 * If this file is unavailable or the dates in it are malformed then 											 *
 * the following default values will be used by the "Pre-K Finder" 												 *
 * application and "Get in Touch" form regardless of the current school year:									 *
 * 																												 *
 *      TODAY = new Date();																						 *
 *      MIN_DOB = "2010-01-01";																					 *
 *      MAX_DOB = TODAY;																						 *
 *      DEFAULT_DOB_ENTRY = "2011-01-01";																		 *
 *      PRE_K_REQUIRED_DOB_YEAR = "2011";																		 *
 *      APPLY_START_DATE = "2015-03-16";																		 *
 *      APPLY_END_DATE = "2015-04-25";																			 *
 *      SCHOOL_YEAR = "2015-16";																				 *
 * 																												 *
 *****************************************************************************************************************
 * 																												 *
 * A DATE WILL ONLY BE CONSIDERED MALFORMED WHEN THE DATE CONSTRUCTOR FAILS!									 *
 * Any well formed date specification provided will be utilized by the											 *
 * "Pre-K Finder" application and "Get in Touch" form.  A well formed date will return							 *
 * a valid date when passed to the javascript Date constructor.													 *
 * For example:																									 *
 * 																												 *
 *      "Valid" values according to the javascript Date constructor:											 *
 * 																												 *
 *           new Date("2010-01-01") = "Thu Dec 31 2009 19:00:00 GMT-0500 (EST)"                                  *
 *           new Date("123") = "Fri Jan 01 123 00:00:00 GMT-0500 (EST)"                                          *
 * 																												 *
 * 																												 *
 *      Invalid values:																							 *
 * 																												 *
 *           new Date("text") = "Invalid Date"                                                                   *
 * 																												 *
 * 																												 *
 *      Improper quotes:																						 *
 * 																												 *
 * 		     new Date(2010-01-01")                                                                               *
 *           "SyntaxError: Unexpected token ILLEGAL"                                                             *
 * 																												 *
 *****************************************************************************************************************/

/* DO NOT CHANGE! */
TODAY = new Date();

/* Date must be "YYYY-MM-DD" in quotes */
MIN_DOB = "2010-01-01";

/* Date must be "YYYY-MM-DD" in quotes or TODAY not in quotes */
MAX_DOB = TODAY;

/* Date must be "YYYY-MM-DD" in quotes */
DEFAULT_DOB_ENTRY = "2011-01-01";

/* String must be "anything" in quotes */
PRE_K_REQUIRED_DOB_YEAR = "2011";

/* Date must be "YYYY-MM-DD" in quotes */
APPLY_START_DATE = "2015-03-16";

/* Date must be "YYYY-MM-DD" in quotes */
APPLY_END_DATE = "2015-04-25";

/* String must be "anything" in quotes */
SCHOOL_YEAR = "2015-16";

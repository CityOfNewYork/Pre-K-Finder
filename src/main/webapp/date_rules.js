/*
 * THIS FILE MUST RESIDE IN THE SAME DIRECTORY AS THE "Get in Touch" FORM!
 * 
 * YYYY-MM-DD is the ISO specified format for dates used by web browser
 * 
 * If the dates below are changed they MUST remain in this format for the
 * "Pre-K Finder" application and "Get in Touch" form to accept them.
 * 
 * The ONLY EXCEPTIONS to the YYYY-MM-DD format are SCHOOL_YEAR and PRE_K_REQUIRED_DOB_YEAR
 * which are free-form text strings.  These variables must also be quoted but no format checking 
 * will be don - what you type for those values WILL be displayed on the "Get in Touch" form 
 * regardless of format.
 * 
 * DO NOT CHANGE the value for the TODAY variable!
 * 
 * The "Apply Now" buttons will APPEAR at the start of APPLY_START_DATE
 * i.e. 2015-03-16 at 12:00 AM
 *
 * The "Apply Now" buttons will NO LONDER APPEAR at the start of APPLY_END_DATE
 * i.e. 2015-04-25 at 12:00 AM

 * When altering date values you must adhere to the YYYY-MM-DD specification
 * and the date string must be quoted
 * 
 * You may change the value of MAX_DOB to a properly formatted and quoted date string
 * 
 * A DATE WILL ONLY BE CONSIDERED MALFORMED WHEN THE DATE CONSTRUCTOR FAILS!
 * Any well formed date specification provided will be utilized by the
 * "Pre-K Finder" application and "Get in Touch" form.  A well formed date will return
 * a valid date when passed to the javascript Date constructor.
 * For example:
 * 		
 * 		"Valid" values according to the javascript Date constructor:
 * 
 * 		new Date("2010-01-01") = "Thu Dec 31 2009 19:00:00 GMT-0500 (EST)"
 * 		new Date("123") = "Fri Jan 01 123 00:00:00 GMT-0500 (EST)"
 * 	
 * 		Invalid values:
 * 
 * 		new Date("text") = "Invalid Date"
 * 
 * 		Improper quotes:
 * 		new Date(2010-01-01")
 * 		"SyntaxError: Unexpected token ILLEGAL"
 * 	
 * 
 * 
 * If this file is unavailable or the dates in it are malformed then 
 * the following default values will be used by the "Pre-K Finder" 
 * application and "Get in Touch" form regardless of the current school year:
 * 
 * 		TODAY = new Date();
 * 		MIN_DOB = "2010-01-01";
 * 		MAX_DOB = TODAY;
 * 		DEFAULT_DOB_ENTRY = "2011-01-01";
 * 		PRE_K_REQUIRED_DOB_YEAR = "2011";
 * 		APPLY_START_DATE = "2015-03-16";
 * 		APPLY_END_DATE = "2015-04-25";
 * 		SCHOOL_YEAR = "2015-16";
 */

/* DO NOT CHANGE! */
TODAY = new Date();

MIN_DOB = "2010-01-01";

MAX_DOB = TODAY;

DEFAULT_DOB_ENTRY = "2011-01-01";

PRE_K_REQUIRED_DOB_YEAR = "2011";

APPLY_START_DATE = "2015-03-16";

APPLY_END_DATE = "2015-04-25";

SCHOOL_YEAR = "2015-16";
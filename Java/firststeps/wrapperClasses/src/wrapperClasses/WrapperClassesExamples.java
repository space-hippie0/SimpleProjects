package wrapperClasses;

import java.util.Scanner;
public class WrapperClassesExamples {


    public static void main(String[] args){

        
        // AUTOBOXING (automatic primitive/wrapper conversion) / UNBOXING
        Integer n1 = 1;
        String s1 = "all strings are objects";
        int n2 = 2;
        Ball b1 = new Ball("Red");

        int sum = n1 + n2;
        System.out.println(""+12);

        //Ball weirdSum = b + n2; // this is wrong!!!!

        //String ts =n1;//.toString();
        //System.out.println(""+n2);

        // they are objects, but no need to use new at declaration

        // but still, let's remember variables contain object references

        Ball b2 = new Ball("Red");
        Ball b3=b2;

        System.out.println(b1==b2);

        Integer n3 = 1;
        Integer n4 = 1;

        System.out.println(n3==n4);

        String s3 = "hello";
        String s4 = "hello";

        System.out.println(s3==s4);

        String colorBall1 = b1.getColor();
        String colorBall2 = b2.getColor();

        System.out.println(colorBall1.equals(colorBall2));
    

        // UTILITY METHODS - static methods of the Wrapper class

        // 1. valueOf() - creates a Wrapper object for a given primitive or String

        int n8 = 8;
        Integer n9 = Integer.valueOf(n8);
        System.out.println(n9);

        String s8 = "8";
        Integer n10 = Integer.valueOf(s8);
        System.out.println(n10);


        // 2. xxxValue() - gets the primitive for the given Wrapper Object
        int s9 = n10.intValue();
        System.out.println(s9);

        // 3. parseXxx() - converts String to primitive

        int num1 = Integer.parseInt(s8);
        System.out.println(num1);

        // 4. toString() - converts the Wrapper object or primitive to String
        String str1 = Integer.toString(num1);
        System.out.println(str1);

        // Character Wrapper class utility methods: isLetter(), isDigit(), isSpaceChar()


        
        
        // CONVERSIONS

        // Integer to String

        // Integer to int
        
        // String to int

        // String to Integer

        // int to String

        // Character conversions: toUpper(), toLower()

        
        
        // PARSING VALUES using Scanner 






    }

    

}

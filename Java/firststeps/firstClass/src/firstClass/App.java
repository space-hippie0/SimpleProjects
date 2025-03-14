package firstClass;

public class App {
    public static void main(String[] args) throws Exception {
        //System.out.println("Hello, World!");

        //First fc = new First(1, "Polito");
        //First fc = new First(1, "name1");
        //System.out.println(fc.getInformation());
        //String n = fc.getName();
        //System.out.println(n);
        //fc.setDescription("this is a very peculiar description, indeed");
        //System.out.println(fc.getInformation());

        Bicycle bike, bike2, bike3; // declare variable bike
        bike = new Bicycle("purple");
        System.out.println(bike.getColor());

        bike2=bike;
        System.out.println(bike2.getColor());

        bike3 = new Bicycle("red", "Tern");
        System.out.println(bike3.getColor());

        //illegal because color is private
        //System.out.println(bike3.color);

        System.out.println(bike3.plate);
        
        String array[]= new String[1];

        System.out.println(array.toString());



        

    }
}

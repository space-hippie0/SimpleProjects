public class App {
    public static void main(String[] args) throws Exception {
        // System.out.println("Hello, World!");

        Bicycle bike = new Bicycle("huge");
        System.out.println(bike.getColor());
        System.out.println(bike.getModelNumber());
        bike.setColor("black");
        bike.setModelNumber(333);
        System.out.println(bike.getColor());
        System.out.println(bike.getModelNumber());
        
    }
}

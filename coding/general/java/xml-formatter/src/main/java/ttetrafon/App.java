package ttetrafon;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;

public class App {
    public static void main(String[] args) {
        List<DataClass> data = new ArrayList<DataClass>();
        data.add(new DataClass("ttetrafon", "123456"));
        data.add(new DataClass("mpampis", "75311594"));
        data.add(new DataClass("maria", "879431764"));

        XmlMapper xmlMapper = new XmlMapper();
        try {
        	String res = xmlMapper.writeValueAsString(data);
        	System.out.println(res);
        }
        catch (Exception e) {
        	e.printStackTrace();
        }
    }
}

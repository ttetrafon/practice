package ttetrafon;

public class DataClass {
	private String name;
	private String value;
	
	public DataClass() {}
	public DataClass(String name, String value) {
		this.name = name;
		this.value = value;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	public void setValue(String value) {
		this.value = value;
	}
	
	public String getName() {
		return this.name;
	}
	public String getValue() {
		return this.value;
	}
}

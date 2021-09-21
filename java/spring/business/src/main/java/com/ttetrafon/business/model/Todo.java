package com.ttetrafon.business.model;

import java.util.Date;

public class Todo {
    private int id;
    private String user;
    private String desc;
    private Date targetDate;
    private boolean isDone;

	public Todo() {}
	public Todo(int id, String user, String desc, Date targetDate, boolean isDone) {
		this.id = id;
		this.user = user;
		this.desc = desc;
		this.targetDate = targetDate;
		this.isDone = isDone;
	}

	public void setId(int id) {
		this.id = id;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public void setTargetDate(Date targetDate) {
		this.targetDate = targetDate;
	}
	public void setIsDone(boolean isDone) {
		this.isDone = isDone;
	}

	public int setId() {
		return this.id;
	}
	public String getUser() {
		return this.user;
	}
	public String getDesc() {
		return this.desc;
	}
	public Date getTargetDate() {
		return this.targetDate;
	}
	public boolean getIsDone() {
		return this.isDone;
	}
}